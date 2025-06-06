
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
      // Récupérer les données du locataire pour l'email
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('name, email')
        .eq('id', tenantId)
        .single();

      if (tenantError) {
        console.error("Error fetching tenant data:", tenantError);
        throw new Error("Impossible de récupérer les données du locataire");
      }

      // Vérifier si une invitation active existe déjà pour ce locataire
      const { data: existingInvites, error: checkError } = await supabase
        .from('tenant_invitations')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('email', email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      let invitationCreated = false;
      let invitationId = '';
      let invitationToken = '';
      
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
        invitationCreated = true;
        invitationId = existingInvites.id;
        invitationToken = token;
      } else {
        // Sinon, créer une nouvelle invitation
        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const { data: newInvite, error } = await supabase
          .from('tenant_invitations')
          .insert({
            tenant_id: tenantId,
            email,
            token,
            expires_at: expiresAt.toISOString(),
            user_id: user.id,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        invitationCreated = true;
        invitationId = newInvite.id;
        invitationToken = newInvite.token;
      }

      // Si l'invitation a été créée/mise à jour avec succès, envoyer l'email
      if (invitationCreated) {
        console.log("Sending invitation email to:", email);
        
        // Notification d'envoi en cours
        toast({
          title: "Envoi en cours",
          description: `Envoi de l'invitation à ${email}...`,
        });
        
        try {
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-tenant-email', {
            body: {
              tenantId: tenantId,
              subject: "Invitation à rejoindre l'espace locataire",
              content: `
                <p>Bonjour ${tenantData.name},</p>
                <p>Vous avez été invité(e) à rejoindre l'espace locataire de votre propriété.</p>
                <p>Pour créer votre compte et accéder à vos informations, veuillez cliquer sur le lien ci-dessous :</p>
                <p><a href="${window.location.origin}/tenant-signup?invitation=${invitationToken}">Créer mon compte</a></p>
                <p>Une fois votre compte créé, vous pourrez accéder à toutes les fonctionnalités de l'espace locataire.</p>
                <p>Cordialement,<br>Votre équipe de gestion immobilière</p>
              `,
              category: 'invitation'
            }
          });

          console.log("Email function response:", emailData);

          if (emailError) {
            console.error("Error sending invitation email:", emailError);
            
            toast({
              title: "Invitation créée",
              description: "L'invitation a été créée mais l'email n'a pas pu être envoyé. Veuillez vérifier la configuration email.",
              variant: "destructive",
            });
          } else {
            console.log("Invitation email sent successfully");
            
            toast({
              title: "Invitation envoyée avec succès",
              description: `L'invitation a été envoyée à ${email}`,
            });
          }
        } catch (emailError: any) {
          console.error("Error in email sending process:", emailError);
          console.error("Error details:", emailError.message, emailError.stack);
          
          toast({
            title: "Invitation créée",
            description: "L'invitation a été créée mais l'email n'a pas pu être envoyé automatiquement",
            variant: "destructive",
          });
        }
      }

      onClose();
      return true;
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      console.error("Error details:", error.message, error.stack);
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
    } catch (error: any) {
      console.error("Error cancelling invitation:", error);
      console.error("Error details:", error.message, error.stack);
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
      // Récupérer les informations de l'invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('tenant_invitations')
        .select('tenant_id, email')
        .eq('id', invitationId)
        .single();

      if (inviteError || !invitation) {
        throw new Error("Invitation non trouvée");
      }

      // Récupérer les données du locataire
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('name, email')
        .eq('id', invitation.tenant_id)
        .single();

      if (tenantError) {
        throw new Error("Impossible de récupérer les données du locataire");
      }

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

      // Envoyer l'email de nouveau
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-tenant-email', {
          body: {
            tenantId: invitation.tenant_id,
            subject: "Nouvelle invitation à rejoindre l'espace locataire",
            content: `
              <p>Bonjour ${tenantData.name},</p>
              <p>Vous avez reçu une nouvelle invitation à rejoindre l'espace locataire de votre propriété.</p>
              <p>Pour créer votre compte et accéder à vos informations, veuillez cliquer sur le lien ci-dessous :</p>
              <p><a href="${window.location.origin}/signup?invitation=true">Créer mon compte</a></p>
              <p>Une fois votre compte créé, vous pourrez accéder à toutes les fonctionnalités de l'espace locataire.</p>
              <p>Cordialement,<br>Votre équipe de gestion immobilière</p>
            `,
            category: 'invitation'
          }
        });

        console.log("Email function response:", emailData);

        if (emailError) {
          console.error("Error sending resend email:", emailError);
          console.error("Error details:", emailError.message, emailError.stack);
          
          toast({
            title: "Invitation mise à jour",
            description: "L'invitation a été mise à jour mais l'email n'a pas pu être envoyé",
            variant: "destructive",
          });
        } else {
          console.log("Resend invitation email sent successfully");
        }
      } catch (emailError: any) {
        console.error("Error in resend email process:", emailError);
        console.error("Error details:", emailError.message, emailError.stack);
      }

      toast({
        title: "Invitation renvoyée",
        description: "L'invitation a été renvoyée avec succès",
      });

      return true;
    } catch (error: any) {
      console.error("Error resending invitation:", error);
      console.error("Error details:", error.message, error.stack);
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
