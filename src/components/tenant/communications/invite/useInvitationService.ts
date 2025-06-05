
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
        description: "Vous devez être connecté pour envoyer une invitation",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    console.log("Starting invitation process for:", email, "tenant:", tenantId);

    try {
      // Check if invitation already exists
      const { data: existingInvitation, error: checkError } = await supabase
        .from('tenant_invitations')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('status', 'pending')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing invitation:", checkError);
        throw checkError;
      }

      if (existingInvitation) {
        console.log("Existing invitation found:", existingInvitation);
        toast({
          title: "Invitation déjà envoyée",
          description: "Une invitation est déjà en cours pour ce locataire.",
          variant: "destructive",
        });
        return false;
      }

      // Check if user profile already exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error checking existing profile:", profileError);
      }

      if (existingProfile) {
        console.log("Profile already exists, linking directly:", existingProfile);
        
        const { error: linkError } = await supabase
          .from('tenants')
          .update({ tenant_profile_id: existingProfile.id })
          .eq('id', tenantId);

        if (linkError) {
          console.error("Error linking profile:", linkError);
          throw linkError;
        }

        toast({
          title: "Profil lié",
          description: "Le profil existant a été lié au locataire.",
        });
        onClose();
        return true;
      }

      // Create new invitation
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      console.log("Creating new invitation with token:", token);

      const { data: invitationData, error: insertError } = await supabase
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

      if (insertError) {
        console.error("Error creating invitation:", insertError);
        throw insertError;
      }

      console.log("Invitation created successfully:", invitationData);

      // Send invitation email via edge function
      const invitationUrl = `${window.location.origin}/invite/${token}`;
      console.log("Calling send-tenant-email function with URL:", invitationUrl);

      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-tenant-email', {
        body: {
          tenantId: tenantId,
          subject: "Invitation - Portail Locataire",
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb; text-align: center;">Bienvenue sur votre portail locataire</h1>
              
              <p>Bonjour,</p>
              
              <p>Vous avez été invité(e) à rejoindre votre portail locataire. Ce portail vous permettra de :</p>
              
              <ul style="color: #666; line-height: 1.6;">
                <li>Consulter les détails de votre bail</li>
                <li>Suivre vos paiements de loyer</li>
                <li>Faire des demandes de maintenance</li>
                <li>Communiquer avec votre propriétaire</li>
                <li>Accéder à vos documents</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" 
                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Créer mon compte
                </a>
              </div>
              
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #475569; font-size: 14px;">
                  <strong>⏰ Important :</strong> Cette invitation expire dans 7 jours. 
                  Si vous ne pouvez pas créer votre compte maintenant, contactez votre propriétaire.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Si vous avez des questions, n'hésitez pas à contacter votre propriétaire.
              </p>
              
              <hr style="border: 1px solid #e2e8f0; margin: 30px 0;" />
              
              <p style="color: #888; font-size: 12px; text-align: center;">
                Ce message a été envoyé via notre système de gestion immobilière.
              </p>
            </div>
          `,
          category: 'invitation'
        }
      });

      console.log("Email function response:", emailResponse);
      console.log("Email function error:", emailError);

      if (emailError) {
        console.error('Email sending error:', emailError);
        toast({
          title: "Invitation créée",
          description: "L'invitation a été créée mais l'email n'a pas pu être envoyé. Vérifiez la configuration de Resend.",
          variant: "destructive",
        });
        return true;
      }

      console.log("Email sent successfully");
      toast({
        title: "Invitation envoyée",
        description: "Le locataire va recevoir un email avec les instructions.",
      });

      onClose();
      return true;
    } catch (error: any) {
      console.error('Error in sendInvitation:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'envoyer l'invitation: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendInvitation
  };
};
