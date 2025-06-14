
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
      
      // 1. Récupérer les données du locataire
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, email, tenant_profile_id')
        .eq('id', tenantId)
        .single();

      if (tenantError || !tenant) {
        console.error("Error fetching tenant:", tenantError);
        throw new Error("Locataire non trouvé");
      }

      console.log("Tenant found:", tenant);

      // 2. Vérifier si le locataire est déjà lié à un profil
      if (tenant.tenant_profile_id) {
        toast({
          title: "Utilisateur déjà lié",
          description: "Ce locataire a déjà un compte actif dans le système.",
          variant: "destructive",
        });
        return { success: false, error: "User already linked" };
      }

      // 3. Supprimer les anciennes invitations pour ce locataire
      await supabase
        .from('tenant_invitations')
        .delete()
        .eq('email', email)
        .eq('tenant_id', tenantId);

      console.log("Cleaned up old invitations");

      // 4. Générer un token unique pour l'invitation
      const invitationToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

      // 5. Créer l'invitation
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

      // 6. Construire l'URL d'invitation
      const baseUrl = window.location.origin;
      const invitationUrl = `${baseUrl}/tenant-signup?invitation=${invitationToken}`;

      // 7. Envoyer l'email via l'edge function
      console.log("Sending invitation email via edge function");
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-tenant-email', {
        body: {
          tenantId: tenantId,
          subject: "Invitation à rejoindre le portail locataire",
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; text-align: center;">Invitation au portail locataire</h2>
              <p>Bonjour <strong>${tenant.name}</strong>,</p>
              <p>Vous avez été invité(e) à rejoindre le portail locataire. Pour créer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" 
                   style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Créer mon compte
                </a>
              </div>
              <p>Ou copiez et collez ce lien dans votre navigateur :</p>
              <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; word-break: break-all;">
                ${invitationUrl}
              </p>
              <p><strong>Ce lien expirera dans 7 jours.</strong></p>
              <p>Une fois votre compte créé, vous pourrez accéder à toutes les fonctionnalités du portail locataire.</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #888; font-size: 12px;">
                Ce message a été envoyé automatiquement depuis notre système de gestion immobilière.
              </p>
            </div>
          `,
          category: 'invitation'
        }
      });

      if (emailError) {
        console.error("Error sending invitation email:", emailError);
        throw new Error("Erreur lors de l'envoi de l'email d'invitation");
      }

      console.log("Invitation email sent successfully:", emailResult);

      toast({
        title: "Invitation envoyée",
        description: `Invitation envoyée avec succès à ${email}`,
      });

      return { 
        success: true, 
        invitation,
        emailResult
      };

    } catch (error: any) {
      console.error("Error in sendInvitation:", error);
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'envoi de l'invitation.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendInvitation,
    isLoading
  };
};
