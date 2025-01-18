import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";

interface InvitationResult {
  success: boolean;
  message: string;
}

export function useTenantProfileLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const checkExistingInvitation = async (email: string): Promise<boolean> => {
    try {
      console.log('Vérification des invitations existantes pour:', email);
      const { data: existingInvites, error } = await supabase
        .from("tenant_invitations")
        .select("*")
        .eq("email", email)
        .eq("status", "pending");

      if (error) {
        console.error('Erreur lors de la vérification des invitations:', error);
        return false;
      }

      return existingInvites && existingInvites.length > 0;
    } catch (err) {
      console.error('Erreur lors de la vérification des invitations:', err);
      return false;
    }
  };

  const sendInvitationEmail = async (tenant: Tenant) => {
    try {
      console.log('Envoi de l\'email d\'invitation à:', tenant.email);
      const response = await supabase.functions.invoke('send-tenant-email', {
        body: {
          to: [tenant.email],
          subject: "Invitation à rejoindre le portail locataire",
          content: `
            <p>Bonjour ${tenant.name},</p>
            <p>Vous avez été invité(e) à rejoindre le portail locataire. Pour créer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
            <p><a href="${window.location.origin}/signup">Créer mon compte</a></p>
            <p>Une fois votre compte créé, vous pourrez accéder à toutes les fonctionnalités du portail locataire.</p>
          `
        }
      });

      if (response.error) {
        console.error('Erreur lors de l\'envoi de l\'email:', response.error);
        throw new Error(response.error.message);
      }

      console.log('Email d\'invitation envoyé avec succès');
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'envoi de l\'email:', err);
      return false;
    }
  };

  const createInvitation = async (tenant: Tenant): Promise<InvitationResult> => {
    try {
      console.log('Création d\'une invitation pour:', tenant.email);
      const { error: inviteError } = await supabase
        .from("tenant_invitations")
        .insert({
          tenant_id: tenant.id,
          email: tenant.email,
          token: crypto.randomUUID(),
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (inviteError) {
        console.error('Erreur lors de la création de l\'invitation:', inviteError);
        return {
          success: false,
          message: "Impossible de créer l'invitation"
        };
      }

      // Envoyer l'email d'invitation
      const emailSent = await sendInvitationEmail(tenant);
      if (!emailSent) {
        return {
          success: false,
          message: "L'invitation a été créée mais l'email n'a pas pu être envoyé"
        };
      }

      return {
        success: true,
        message: "Invitation créée et email envoyé avec succès"
      };
    } catch (err) {
      console.error('Erreur lors de la création de l\'invitation:', err);
      return {
        success: false,
        message: "Erreur lors de la création de l'invitation"
      };
    }
  };

  const findTenantProfile = async (email: string) => {
    try {
      console.log('Recherche du profil pour:', email);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la recherche du profil:', error);
        return null;
      }

      return profile;
    } catch (err) {
      console.error('Erreur lors de la recherche du profil:', err);
      return null;
    }
  };

  const updateTenantProfile = async (tenantId: string, profileId: string) => {
    try {
      console.log('Mise à jour du profil tenant:', { tenantId, profileId });
      const { error } = await supabase
        .from("tenants")
        .update({ 
          tenant_profile_id: profileId,
          updated_at: new Date().toISOString()
        })
        .eq("id", tenantId);

      if (error) {
        console.error('Erreur lors de la mise à jour du tenant:', error);
        throw error;
      }

      // Envoyer un email de confirmation
      const { data: tenant } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", tenantId)
        .single();

      if (tenant) {
        await supabase.functions.invoke('send-tenant-email', {
          body: {
            to: [tenant.email],
            subject: "Profil locataire lié avec succès",
            content: `
              <p>Bonjour ${tenant.name},</p>
              <p>Votre profil a été lié avec succès au portail locataire. Vous pouvez maintenant accéder à toutes les fonctionnalités.</p>
              <p>Connectez-vous à votre compte pour commencer.</p>
            `
          }
        });
      }

      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil tenant:', err);
      throw err;
    }
  };

  const linkProfile = async (tenant: Tenant): Promise<boolean> => {
    setIsLoading(true);
    setError("");

    try {
      console.log('Tentative de liaison du profil locataire pour:', tenant.email);
      
      const profile = await findTenantProfile(tenant.email);

      if (!profile) {
        console.log('Aucun profil trouvé, envoi d\'une invitation');
        const hasExistingInvite = await checkExistingInvitation(tenant.email);
        
        if (hasExistingInvite) {
          toast({
            title: "Information",
            description: "Une invitation a déjà été envoyée à cet email. Le locataire doit créer son compte pour finaliser la liaison.",
          });
          return false;
        }

        const invitationResult = await createInvitation(tenant);
        toast({
          title: invitationResult.success ? "Invitation envoyée" : "Erreur",
          description: invitationResult.message,
          variant: invitationResult.success ? "default" : "destructive",
        });
        return invitationResult.success;
      }

      console.log('Profil trouvé, mise à jour du tenant');
      await updateTenantProfile(tenant.id, profile.id);
      
      console.log('Profil locataire lié avec succès');
      toast({
        title: "Succès",
        description: "Le profil locataire a été lié avec succès",
      });

      return true;
    } catch (err: any) {
      console.error('Erreur dans linkProfile:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la liaison du profil",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    linkProfile,
    isLoading,
    error,
  };
}