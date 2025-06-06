
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export const useInvitationService = (tenantId: string, onClose: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendInvitation = async (email: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer des invitations",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Vérifier si une invitation active existe déjà pour ce locataire
      const { data: existingInvites, error: checkError } = await supabase
        .from('tenant_invitations')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('email', email)
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString())
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // Si une invitation active existe, mettre à jour cette invitation au lieu d'en créer une nouvelle
      if (existingInvites) {
        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        
        const { error: updateError } = await supabase
          .from('tenant_invitations')
          .update({
            token,
            expires_at: expiresAt.toISOString(),
            status: 'pending'
          })
          .eq('id', existingInvites.id);
          
        if (updateError) throw updateError;
        
        toast({
          title: "Invitation mise à jour",
          description: "Une nouvelle invitation a été envoyée au locataire",
        });
        
        onClose();
        return true;
      }

      // Sinon, créer une nouvelle invitation
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase
        .from('tenant_invitations')
        .insert({
          tenant_id: tenantId,
          email,
          token,
          expires_at: expiresAt.toISOString(),
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Invitation envoyée",
        description: "Le locataire recevra un email avec les instructions",
      });

      onClose();
      return true;
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tenant_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation annulée",
        description: "L'invitation a bien été annulée",
      });

      return true;
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler l'invitation",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendInvitation = async (invitationId: string) => {
    setIsLoading(true);
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase
        .from('tenant_invitations')
        .update({
          token,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation renvoyée",
        description: "L'invitation a été renvoyée avec succès",
      });

      return true;
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'invitation",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendInvitation,
    cancelInvitation,
    resendInvitation
  };
};
