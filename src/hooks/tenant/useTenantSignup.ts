
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
      
      // D'abord, vérifier si l'utilisateur existe déjà en listant tous les utilisateurs
      const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === tenantData.email);
      
      if (existingUser) {
        console.log("User already exists, attempting direct login...");
        
        // Tentative de connexion directe
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: tenantData.email,
          password: values.password,
        });

        if (signInError) {
          console.error("Sign in failed:", signInError);
          toast({
            title: "Erreur de connexion",
            description: "Le compte existe mais le mot de passe est incorrect. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }

        if (signInData.user) {
          await linkTenantProfile(signInData.user.id, tenantData, invitationToken);
          return;
        }
      }

      // Créer un nouveau compte avec email confirmé automatiquement
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: tenantData.email,
        password: values.password,
        options: {
          data: {
            first_name: tenantData.name.split(' ')[0] || '',
            last_name: tenantData.name.split(' ').slice(1).join(' ') || '',
            is_tenant_user: true,
            email_confirm: true,
          },
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('Aucune donnée utilisateur retournée');
      }
      
      console.log("✅ User created successfully with ID:", signUpData.user.id);
      
      // Confirmer manuellement l'email si nécessaire
      if (!signUpData.user.email_confirmed_at) {
        console.log("Confirming email manually...");
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          signUpData.user.id,
          { email_confirm: true }
        );
        
        if (confirmError) {
          console.error("Error confirming email:", confirmError);
        }
      }
      
      // Lier le tenant au profil utilisateur
      await linkTenantProfile(signUpData.user.id, tenantData, invitationToken);

    } catch (error: any) {
      console.error("=== SIGNUP PROCESS FAILED ===", error);
      setSignupStatus('failed');
      
      let errorMessage = "Une erreur s'est produite lors de la création du compte.";
      
      if (error.message.includes('already registered')) {
        errorMessage = "Un compte existe déjà avec cette adresse email.";
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
        description: "Votre compte a été créé et activé. Redirection vers la connexion...",
      });

      // Forcer la déconnexion et rediriger vers la page de connexion
      setTimeout(async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth?message=account_created&email=' + encodeURIComponent(tenantData.email);
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
