import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";

export function useTenantProfileLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendInvitation = async (tenant: Tenant) => {
    try {
      console.log('Envoi d\'une invitation à:', tenant.email);
      
      const { data: existingInvite } = await supabase
        .from("tenant_invitations")
        .select("*")
        .eq("email", tenant.email)
        .eq("status", "pending")
        .maybeSingle();

      if (existingInvite) {
        console.log('Une invitation existe déjà pour cet email');
        toast({
          title: "Information",
          description: `Une invitation a déjà été envoyée à ${tenant.email}`,
        });
        return true;
      }

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
        throw inviteError;
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
      throw err;
    }
  };

  const linkProfile = async (tenant: Tenant) => {
    setIsLoading(true);
    setError("");

    try {
      console.log('Tentative de liaison du profil locataire pour:', tenant.email);
      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", tenant.email)
        .maybeSingle();

      if (profileError) {
        console.error('Erreur lors de la recherche du profil:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.log('Aucun profil trouvé, envoi d\'une invitation');
        const invitationSent = await sendInvitation(tenant);
        if (invitationSent) {
          toast({
            title: "Information",
            description: "Une invitation a été envoyée au locataire pour créer un compte.",
          });
          return false;
        }
      }

      if (profile) {
        console.log('Profil trouvé:', profile);

        const { error: updateError } = await supabase
          .from("tenants")
          .update({ 
            tenant_profile_id: profile.id,
            updated_at: new Date().toISOString()
          })
          .eq("id", tenant.id);

        if (updateError) {
          console.error('Erreur lors de la mise à jour du tenant:', updateError);
          throw updateError;
        }

        console.log('Profil locataire lié avec succès');
        toast({
          title: "Succès",
          description: "Le profil locataire a été lié avec succès",
        });

        return true;
      }

      return false;
    } catch (err: any) {
      console.error('Erreur dans linkProfile:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
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