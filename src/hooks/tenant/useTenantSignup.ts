
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
      console.log("=== STARTING TENANT SIGNUP ===");
      console.log("Creating account for:", tenantData.email);
      
      // D'abord, essayer de se connecter pour voir si l'utilisateur existe déjà
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: tenantData.email,
        password: values.password,
      });

      if (!signInError && signInData.user) {
        console.log("✅ User already exists and signed in successfully");
        await linkTenantProfile(signInData.user.id, tenantData, invitationToken);
        return;
      }

      // Si la connexion échoue pour une raison autre que "credentials invalides", on arrête
      if (signInError && !signInError.message.includes('Invalid login credentials')) {
        console.error("Unexpected sign in error:", signInError);
        throw signInError;
      }

      // Si les credentials sont invalides, essayer de créer un nouveau compte
      console.log("User doesn't exist or wrong password, attempting to create new account...");
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: tenantData.email,
        password: values.password,
        options: {
          data: {
            first_name: tenantData.name.split(' ')[0] || '',
            last_name: tenantData.name.split(' ').slice(1).join(' ') || '',
            is_tenant_user: true,
          },
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        
        // Si l'utilisateur existe déjà, essayer de se connecter avec un message d'erreur plus clair
        if (signUpError.message?.includes('already registered')) {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cette adresse email. Vérifiez votre mot de passe ou contactez l'administrateur.",
            variant: "destructive",
          });
          setSignupStatus('failed');
          return;
        }
        
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('Aucune donnée utilisateur retournée');
      }
      
      console.log("✅ New user created successfully with ID:", signUpData.user.id);
      
      // Avec la confirmation d'email désactivée, on devrait avoir une session immédiatement
      if (signUpData.session) {
        console.log("✅ Session available, proceeding with linking...");
        await linkTenantProfile(signUpData.user.id, tenantData, invitationToken);
        return;
      }

      // Si pas de session, essayer de se connecter directement
      console.log("No session returned, attempting direct sign in...");
      const { data: directSignInData, error: directSignInError } = await supabase.auth.signInWithPassword({
        email: tenantData.email,
        password: values.password,
      });

      if (directSignInError) {
        console.error("Direct sign in failed:", directSignInError);
        throw directSignInError;
      }

      if (directSignInData.user) {
        console.log("✅ Direct sign in successful");
        await linkTenantProfile(directSignInData.user.id, tenantData, invitationToken);
        return;
      }

      throw new Error("Impossible de créer ou connecter l'utilisateur");

    } catch (error: any) {
      console.error("=== SIGNUP PROCESS FAILED ===", error);
      setSignupStatus('failed');
      
      let errorMessage = "Une erreur s'est produite lors de la création du compte.";
      
      if (error.message?.includes('already registered')) {
        errorMessage = "Un compte existe déjà avec cette adresse email. Vérifiez votre mot de passe.";
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Informations de connexion invalides. Vérifiez votre mot de passe.";
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
      console.log("Starting tenant profile linking for user:", userId);

      // 1. Lier le tenant au profil utilisateur
      const { error: updateTenantError } = await supabase
        .from('tenants')
        .update({ 
          tenant_profile_id: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenantData.id)
        .eq('email', tenantData.email);

      if (updateTenantError) {
        console.error("Error updating tenant:", updateTenantError);
        throw new Error("Impossible de lier le profil au locataire");
      }

      console.log("✅ Tenant profile linked successfully");

      // 2. Créer ou mettre à jour le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: tenantData.email,
          first_name: tenantData.name.split(' ')[0] || '',
          last_name: tenantData.name.split(' ').slice(1).join(' ') || '',
          is_tenant_user: true,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error("Error creating/updating profile:", profileError);
      }

      console.log("✅ Profile created/updated successfully");

      // 3. Marquer l'invitation comme acceptée
      const { error: updateInvitationError } = await supabase
        .from('tenant_invitations')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('token', invitationToken);

      if (updateInvitationError) {
        console.error("Error updating invitation status:", updateInvitationError);
      }

      setSignupStatus('success');
      console.log("=== SIGNUP PROCESS COMPLETED SUCCESSFULLY ===");

      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé et activé. Redirection vers le tableau de bord...",
      });

      // Rediriger vers le dashboard tenant
      setTimeout(() => {
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
