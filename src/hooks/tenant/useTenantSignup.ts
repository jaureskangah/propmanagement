
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
      
      // Try to sign in first to check if user already exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: tenantData.email,
        password: values.password,
      });

      if (!signInError && signInData.user) {
        console.log("User already exists and password is correct, proceeding with linking...");
        await linkTenantProfile(signInData.user.id, tenantData, invitationToken);
        return;
      }

      // If sign in failed, try to create a new account
      console.log("Creating new user account...");
      
      // Créer un nouveau compte avec email confirmé automatiquement
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: tenantData.email,
        password: values.password,
        options: {
          data: {
            first_name: tenantData.name.split(' ')[0] || '',
            last_name: tenantData.name.split(' ').slice(1).join(' ') || '',
            is_tenant_user: true,
          },
          emailRedirectTo: undefined, // Éviter la redirection email
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        
        // If user already exists but password was wrong
        if (signUpError.message?.includes('already registered')) {
          toast({
            title: "Erreur de connexion",
            description: "Un compte existe déjà avec cette adresse email mais le mot de passe est incorrect.",
            variant: "destructive",
          });
          return;
        }
        
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('Aucune donnée utilisateur retournée');
      }
      
      console.log("✅ User created successfully with ID:", signUpData.user.id);
      
      // Si l'utilisateur a été créé mais n'est pas confirmé, on va forcer la connexion
      if (!signUpData.session) {
        console.log("No session returned, attempting direct sign in...");
        
        // Essayer de se connecter immédiatement après la création
        const { data: directSignInData, error: directSignInError } = await supabase.auth.signInWithPassword({
          email: tenantData.email,
          password: values.password,
        });

        if (directSignInError) {
          console.error("Direct sign in failed:", directSignInError);
          
          // Si la connexion échoue à cause de l'email non confirmé, on informe l'utilisateur
          if (directSignInError.message?.includes('Email not confirmed')) {
            toast({
              title: "Compte créé",
              description: "Votre compte a été créé. Un email de confirmation a été envoyé. Veuillez confirmer votre email avant de vous connecter.",
              variant: "default",
            });
            
            setTimeout(() => {
              window.location.href = '/auth?message=check_email&email=' + encodeURIComponent(tenantData.email);
            }, 2000);
            return;
          }
          
          throw directSignInError;
        }

        if (directSignInData.user) {
          console.log("✅ Direct sign in successful");
          await linkTenantProfile(directSignInData.user.id, tenantData, invitationToken);
          return;
        }
      } else {
        // Si on a une session immédiatement, procéder avec la liaison
        console.log("✅ User signed up with immediate session");
        await linkTenantProfile(signUpData.user.id, tenantData, invitationToken);
      }

    } catch (error: any) {
      console.error("=== SIGNUP PROCESS FAILED ===", error);
      setSignupStatus('failed');
      
      let errorMessage = "Une erreur s'est produite lors de la création du compte.";
      
      if (error.message?.includes('already registered')) {
        errorMessage = "Un compte existe déjà avec cette adresse email.";
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Impossible de créer le compte. Veuillez réessayer.";
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

      // Rediriger vers le dashboard tenant au lieu de forcer la déconnexion
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
