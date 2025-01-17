import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";

export function useTenantProfileLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendInvitation = async (tenant: Tenant) => {
    try {
      // Créer une invitation dans la table tenant_invitations
      const { error: inviteError } = await supabase
        .from("tenant_invitations")
        .insert({
          tenant_id: tenant.id,
          email: tenant.email,
          token: crypto.randomUUID(),
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (inviteError) throw inviteError;

      toast({
        title: "Invitation Envoyée",
        description: `Une invitation a été envoyée à ${tenant.email}`,
      });

    } catch (err) {
      console.error('Error sending invitation:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
    }
  };

  const linkProfile = async (tenant: Tenant) => {
    setIsLoading(true);
    setError("");

    try {
      console.log('Tentative de liaison du profil locataire pour:', tenant.email);
      
      // Vérifier si un profil existe pour cet email
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", tenant.email)
        .maybeSingle();

      if (profileError) {
        console.error('Erreur lors de la recherche du profil:', profileError);
        throw profileError;
      }

      if (!profiles) {
        // Si aucun profil n'existe, envoyer une invitation
        await sendInvitation(tenant);
        const errorMsg = "Aucun compte trouvé pour cet email. Une invitation a été envoyée au locataire pour créer un compte.";
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Profil trouvé:', profiles);

      // Mettre à jour le tenant avec l'ID du profil
      const { error: updateError } = await supabase
        .from("tenants")
        .update({ 
          tenant_profile_id: profiles.id,
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