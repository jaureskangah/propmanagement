
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface InvitationData {
  email: string;
  tenantId: string;
}

export const useInvitationService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendInvitation = async ({ email, tenantId }: InvitationData) => {
    setIsLoading(true);
    
    try {
      console.log("Starting invitation process for:", email, "tenant:", tenantId);
      
      // Récupérer les données du locataire
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, email, tenant_profile_id')
        .eq('id', tenantId)
        .single();

      if (tenantError || !tenant) {
        console.error("Error fetching tenant:", tenantError);
        throw new Error("Locataire non trouvé");
      }

      // Vérifier si le locataire est déjà lié à un profil
      if (tenant.tenant_profile_id) {
        toast({
          title: "Utilisateur déjà lié",
          description: "Ce locataire a déjà un compte actif dans le système.",
          variant: "destructive",
        });
        return { success: false, error: "User already linked" };
      }

      // Vérifier s'il y a déjà une invitation en attente
      const { data: existingInvitation, error: invitationCheckError } = await supabase
        .from('tenant_invitations')
        .select('id, status, expires_at')
        .eq('email', email)
        .eq('tenant_id', tenantId)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (invitationCheckError) {
        console.error("Error checking existing invitation:", invitationCheckError);
        throw invitationCheckError;
      }

      if (existingInvitation) {
        toast({
          title: "Invitation déjà envoyée",
          description: "Une invitation valide existe déjà pour cette adresse email.",
          variant: "destructive",
        });
        return { success: false, error: "Active invitation exists" };
      }

      // Générer un token unique pour l'invitation
      const invitationToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

      // Créer l'invitation
      const { data: invitation, error: createError } = await supabase
        .from('tenant_invitations')
        .insert({
          email,
          tenant_id: tenantId,
          token: invitationToken,
          expires_at: expiresAt.toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
          status: 'pending'
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating invitation:", createError);
        throw createError;
      }

      console.log("Invitation created successfully:", invitation);

      // Construire l'URL d'invitation
      const baseUrl = window.location.origin;
      const invitationUrl = `${baseUrl}/tenant-signup?invitation=${invitationToken}`;

      // Envoyer l'email via l'edge function
      console.log("Sending invitation email via edge function");
      const response = await supabase.functions.invoke('send-tenant-email', {
        body: {
          tenantId: tenantId,
          subject: "Invitation à rejoindre le portail locataire",
          content: `
            <h2>Bonjour ${tenant.name},</h2>
            <p>Vous avez été invité(e) à rejoindre le portail locataire. Pour créer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
            <p><a href="${invitationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Créer mon compte</a></p>
            <p>Ou copiez et collez ce lien dans votre navigateur :</p>
            <p>${invitationUrl}</p>
            <p>Ce lien expirera dans 7 jours.</p>
            <p>Une fois votre compte créé, vous pourrez accéder à toutes les fonctionnalités du portail locataire.</p>
          `,
          category: 'invitation'
        }
      });

      if (response.error) {
        console.error("Error sending invitation email:", response.error);
        throw new Error("Erreur lors de l'envoi de l'email d'invitation");
      }

      console.log("Invitation email sent successfully");

      toast({
        title: "Invitation envoyée",
        description: `Invitation envoyée avec succès à ${email}`,
      });

      return { 
        success: true, 
        invitation
      };

    } catch (error: any) {
      console.error("Error sending invitation:", error);
      
      let errorMessage = "Une erreur s'est produite lors de l'envoi de l'invitation.";
      
      if (error.message?.includes('unique_tenant_email')) {
        errorMessage = "Un locataire avec cette adresse email existe déjà.";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resendInvitation = async (email: string, tenantId: string) => {
    console.log("Resending invitation for:", email);
    
    // Marquer les anciennes invitations comme expirées
    await supabase
      .from('tenant_invitations')
      .update({ 
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .eq('tenant_id', tenantId)
      .eq('status', 'pending');

    // Envoyer une nouvelle invitation
    return sendInvitation({ email, tenantId });
  };

  return {
    sendInvitation,
    resendInvitation,
    isLoading
  };
};
