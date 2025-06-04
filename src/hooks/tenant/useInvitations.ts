
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export const useInvitations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendInvitation = async (tenantId: string, email: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer une invitation.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Check if invitation already exists for this tenant
      const { data: existingInvitation } = await supabase
        .from('tenant_invitations')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('status', 'pending')
        .single();

      if (existingInvitation) {
        toast({
          title: "Invitation déjà envoyée",
          description: "Une invitation est déjà en cours pour ce locataire.",
          variant: "destructive",
        });
        return false;
      }

      // Check if user profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingProfile) {
        // Link existing profile directly
        const { error: linkError } = await supabase
          .from('tenants')
          .update({ tenant_profile_id: existingProfile.id })
          .eq('id', tenantId);

        if (linkError) throw linkError;

        toast({
          title: "Profil lié",
          description: "Le profil existant a été lié au locataire.",
        });
        return true;
      }

      // Create new invitation
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: insertError } = await supabase
        .from('tenant_invitations')
        .insert({
          tenant_id: tenantId,
          email,
          token,
          expires_at: expiresAt.toISOString(),
          user_id: user.id,
          status: 'pending'
        });

      if (insertError) throw insertError;

      // Send invitation email
      const invitationUrl = `${window.location.origin}/invite/${token}`;
      
      const { error: emailError } = await supabase.functions.invoke('send-tenant-email', {
        body: {
          to: [email],
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
          `
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        toast({
          title: "Invitation créée",
          description: "L'invitation a été créée mais l'email n'a pas pu être envoyé. Veuillez partager le lien manuellement.",
          variant: "destructive",
        });
        return true;
      }

      toast({
        title: "Invitation envoyée",
        description: "Le locataire va recevoir un email avec les instructions.",
      });

      return true;
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation.",
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
      // Get invitation details
      const { data: invitation, error: fetchError } = await supabase
        .from('tenant_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (fetchError || !invitation) throw new Error('Invitation not found');

      // Generate new token and extend expiration
      const newToken = crypto.randomUUID();
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 7);

      // Update invitation
      const { error: updateError } = await supabase
        .from('tenant_invitations')
        .update({
          token: newToken,
          expires_at: newExpiresAt.toISOString(),
          status: 'pending'
        })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      // Resend email with new token
      const invitationUrl = `${window.location.origin}/invite/${newToken}`;
      
      const { error: emailError } = await supabase.functions.invoke('send-tenant-email', {
        body: {
          to: [invitation.email],
          subject: "Rappel - Invitation Portail Locataire",
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb; text-align: center;">Rappel - Votre portail locataire vous attend</h1>
              
              <p>Bonjour,</p>
              
              <p>Nous vous avons récemment envoyé une invitation pour rejoindre votre portail locataire. Cette invitation avait expiré, nous vous en envoyons donc une nouvelle.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" 
                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Créer mon compte maintenant
                </a>
              </div>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⚠️ Attention :</strong> Cette nouvelle invitation expire dans 7 jours.
                </p>
              </div>
              
              <p style="color: #666;">
                Si vous rencontrez des difficultés pour créer votre compte, contactez directement votre propriétaire.
              </p>
              
              <hr style="border: 1px solid #e2e8f0; margin: 30px 0;" />
              
              <p style="color: #888; font-size: 12px; text-align: center;">
                Ce message a été envoyé via notre système de gestion immobilière.
              </p>
            </div>
          `
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Invitation renvoyée",
        description: "Une nouvelle invitation a été envoyée.",
      });

      return true;
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'invitation.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendInvitation,
    resendInvitation,
    isLoading
  };
};
