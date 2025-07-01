
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
      console.log("=== STARTING TENANT SIGNUP - IMPROVED ===");
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
        console.error("Signup error:", signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('Aucune donnée utilisateur retournée');
      }
      
      console.log("✅ New user created successfully with ID:", signUpData.user.id);
      
      // Lier immédiatement le profil du locataire avec vérification
      await linkTenantProfile(signUpData.user.id, tenantData, invitationToken);

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

  const linkTenantProfile = async (userId: string, tenantData: TenantData, invitationToken: string) => {
    try {
      setSignupStatus('linking');
      console.log("=== LINKING TENANT PROFILE - IMPROVED ===");
      console.log("Starting tenant profile linking for user:", userId);
      console.log("Tenant ID:", tenantData.id);

      // 1. Utiliser la fonction RPC pour lier le profil
      const { data: linkResult, error: linkError } = await supabase
        .rpc('link_tenant_profile', {
          p_tenant_id: tenantData.id,
          p_user_id: userId
        });

      if (linkError) {
        console.error("❌ Error linking tenant profile:", linkError);
        throw new Error("Impossible de lier le profil au locataire");
      }

      if (!linkResult) {
        console.error("❌ Link function returned false");
        throw new Error("La fonction de liaison a échoué");
      }

      console.log("✅ Tenant profile linked successfully");

      // 2. Vérifier que la liaison a bien fonctionné
      const { data: verificationData, error: verificationError } = await supabase
        .from('tenants')
        .select('tenant_profile_id, name, email')
        .eq('id', tenantData.id)
        .single();

      if (verificationError || !verificationData?.tenant_profile_id) {
        console.error("❌ Verification failed:", verificationError);
        throw new Error("La vérification de la liaison a échoué");
      }

      console.log("✅ Verification successful:", verificationData);

      // 3. Marquer l'invitation comme acceptée
      console.log("Updating invitation status...");
      const { error: updateInvitationError } = await supabase
        .from('tenant_invitations')
        .update({ status: 'accepted' })
        .eq('token', invitationToken);

      if (updateInvitationError) {
        console.error("❌ Error updating invitation status:", updateInvitationError);
        // Ne pas bloquer le processus pour cette erreur
      } else {
        console.log("✅ Invitation status updated to 'accepted'");
      }

      setSignupStatus('success');
      console.log("=== SIGNUP PROCESS COMPLETED SUCCESSFULLY ===");

      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé et activé. Redirection vers le tableau de bord...",
      });

      // Rediriger vers le dashboard tenant avec un délai
      setTimeout(() => {
        console.log("Redirecting to tenant dashboard...");
        window.location.href = '/tenant/dashboard';
      }, 2000);

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
