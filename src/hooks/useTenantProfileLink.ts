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
    const { data: existingInvite, error } = await supabase
      .from("tenant_invitations")
      .select("*")
      .eq("email", email)
      .eq("status", "pending")
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la vérification des invitations:', error);
      return false;
    }

    return !!existingInvite;
  };

  const createInvitation = async (tenant: Tenant): Promise<InvitationResult> => {
    try {
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

      return {
        success: true,
        message: "Invitation créée avec succès"
      };
    } catch (err) {
      console.error('Erreur lors de la création de l\'invitation:', err);
      return {
        success: false,
        message: "Erreur lors de la création de l'invitation"
      };
    }
  };

  const sendInvitation = async (tenant: Tenant): Promise<boolean> => {
    try {
      console.log('Envoi d\'une invitation à:', tenant.email);
      
      const hasExistingInvite = await checkExistingInvitation(tenant.email);
      if (hasExistingInvite) {
        console.log('Une invitation existe déjà pour cet email');
        toast({
          title: "Information",
          description: `Une invitation a déjà été envoyée à ${tenant.email}`,
        });
        return true;
      }

      const invitationResult = await createInvitation(tenant);
      if (!invitationResult.success) {
        toast({
          title: "Erreur",
          description: invitationResult.message,
          variant: "destructive",
        });
        return false;
      }

      console.log('Invitation créée avec succès');
      toast({
        title: "Invitation Envoyée",
        description: `Une invitation a été envoyée à ${tenant.email}`,
      });

      return true;
    } catch (err) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
      return false;
    }
  };

  const findTenantProfile = async (email: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la recherche du profil:', error);
      throw error;
    }

    return profile;
  };

  const updateTenantProfile = async (tenantId: string, profileId: string) => {
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
  };

  const linkProfile = async (tenant: Tenant): Promise<boolean> => {
    setIsLoading(true);
    setError("");

    try {
      console.log('Tentative de liaison du profil locataire pour:', tenant.email);
      
      const profile = await findTenantProfile(tenant.email);

      if (!profile) {
        console.log('Aucun profil trouvé, envoi d\'une invitation');
        const invitationSent = await sendInvitation(tenant);
        if (invitationSent) {
          toast({
            title: "Information",
            description: "Une invitation a été envoyée au locataire pour créer un compte.",
          });
        }
        return false;
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