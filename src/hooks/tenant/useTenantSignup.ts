
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface TenantData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  properties?: {
    name: string;
  };
}

interface LinkTenantProfileResult {
  success: boolean;
  message: string;
  error_code?: string;
  warning?: string;
  details?: any;
}

export const useTenantSignup = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [signupStatus, setSignupStatus] = useState<'idle' | 'creating' | 'linking' | 'success' | 'failed'>('idle');

  const signUpTenant = async (
    values: { password: string; confirmPassword: string },
    tenantData: TenantData,
    invitationToken: string
  ) => {
    setLoading(true);
    setSignupStatus('creating');

    try {
      console.log("=== STARTING TENANT SIGNUP - ENHANCED VERSION ===");
      console.log("Creating account for:", tenantData.email);
      
      // Créer directement un nouveau compte avec redirection correcte
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: tenantData.email,
        password: values.password,
        options: {
          data: {
            first_name: tenantData.name.split(' ')[0] || '',
            last_name: tenantData.name.split(' ').slice(1).join(' ') || '',
            is_tenant_user: true,
          },
          emailRedirectTo: `${window.location.origin}/tenant/dashboard`
        },
      });

      if (signUpError) {
        console.error("❌ Signup error:", signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('Aucune donnée utilisateur retournée');
      }
      
      console.log("✅ New user created successfully with ID:", signUpData.user.id);
      
      // Lier immédiatement le profil du locataire avec la nouvelle fonction RPC améliorée
      await linkTenantProfileEnhanced(signUpData.user.id, tenantData, invitationToken);

    } catch (error: any) {
      console.error("=== SIGNUP PROCESS FAILED ===", error);
      setSignupStatus('failed');
      
      let errorMessage = "Une erreur s'est produite lors de la création du compte.";
      
      if (error.message?.includes('already registered')) {
        errorMessage = "Un compte existe déjà avec cette adresse email.";
      } else if (error.message?.includes('weak password')) {
        errorMessage = "Le mot de passe n'est pas assez fort.";
      } else if (error.message?.includes('liaison')) {
        errorMessage = "Erreur lors de la liaison du profil. Veuillez contacter l'administrateur.";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const linkTenantProfileEnhanced = async (userId: string, tenantData: TenantData, invitationToken: string) => {
    try {
      setSignupStatus('linking');
      console.log("=== LINKING TENANT PROFILE - ENHANCED VERSION ===");
      console.log("Starting tenant profile linking for user:", userId);
      console.log("Tenant ID:", tenantData.id);

      // 1. Utiliser la fonction RPC améliorée qui retourne un JSON structuré
      const { data: linkResult, error: linkError } = await supabase
        .rpc('link_tenant_profile', {
          p_tenant_id: tenantData.id,
          p_user_id: userId
        });

      if (linkError) {
        console.error("❌ RPC call error:", linkError);
        throw new Error(`Erreur RPC: ${linkError.message}`);
      }

      // 2. Gérer à la fois les anciens (boolean) et nouveaux formats (JSON) pour backward compatibility
      let result: LinkTenantProfileResult;
      
      if (typeof linkResult === 'boolean') {
        console.warn('⚠️ Received old boolean format from RPC, converting...');
        result = {
          success: linkResult,
          message: linkResult ? 'Tenant profile linked successfully (legacy format)' : 'Failed to link tenant profile (legacy format)',
          warning: linkResult ? 'LEGACY_FORMAT' : undefined
        };
      } else {
        result = linkResult as LinkTenantProfileResult;
      }

      console.log("🔍 Enhanced RPC Result:", result);

      if (!result.success) {
        console.error("❌ Linking failed:", result.message);
        
        // Gestion des différents codes d'erreur
        let userMessage = "Impossible de lier le profil au locataire";
        
        switch (result.error_code) {
          case 'TENANT_NOT_FOUND':
            userMessage = "Locataire introuvable dans la base de données";
            break;
          case 'USER_NOT_FOUND':
            userMessage = "Utilisateur introuvable dans le système d'authentification";
            break;
          case 'EMAIL_MISMATCH':
            userMessage = "Les adresses email ne correspondent pas";
            break;
          case 'ALREADY_LINKED_OTHER_USER':
            userMessage = "Ce locataire est déjà lié à un autre utilisateur";
            break;
          case 'VERIFICATION_FAILED':
            userMessage = "La vérification de la liaison a échoué";
            break;
          case 'DATABASE_ERROR':
            userMessage = "Erreur de base de données lors de la liaison";
            break;
          default:
            userMessage = result.message || "Erreur inconnue lors de la liaison";
        }
        
        throw new Error(userMessage);
      }

      // 3. Liaison réussie (peut avoir un warning si déjà lié)
      if (result.warning === 'ALREADY_LINKED') {
        console.log("⚠️ Tenant already linked, continuing...");
      } else if (result.warning === 'LEGACY_FORMAT') {
        console.log("⚠️ Tenant linked using legacy format, but successful");
      } else {
        console.log("✅ Tenant profile linked successfully");
      }

      // 4. Marquer l'invitation comme acceptée
      console.log("Updating invitation status...");
      const { error: updateInvitationError } = await supabase
        .from('tenant_invitations')
        .update({ status: 'accepted' })
        .eq('token', invitationToken);

      if (updateInvitationError) {
        console.error("❌ Error updating invitation status:", updateInvitationError);
        // Ne pas bloquer le processus pour cette erreur, mais logger
      } else {
        console.log("✅ Invitation status updated to 'accepted'");
      }

      setSignupStatus('success');
      console.log("=== SIGNUP PROCESS COMPLETED SUCCESSFULLY ===");

      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé et activé.",
      });

    } catch (error: any) {
      console.error("=== LINKING PROCESS FAILED ===", error);
      setSignupStatus('failed');
      throw error;
    }
  };

  return {
    loading,
    signupStatus,
    signUpTenant,
  };
};
