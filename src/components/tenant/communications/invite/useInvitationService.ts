
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

  const checkExistingUser = async (email: string): Promise<{ exists: boolean; isLinked: boolean; tenant?: any }> => {
    console.log("Checking existing user for email:", email);
    
    // Vérifier si un tenant existe déjà avec cet email
    const { data: existingTenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, name, email, tenant_profile_id')
      .eq('email', email)
      .maybeSingle();

    if (tenantError) {
      console.error("Error checking existing tenant:", tenantError);
      throw tenantError;
    }

    if (existingTenant) {
      const isLinked = existingTenant.tenant_profile_id !== null;
      console.log("Found existing tenant:", existingTenant, "is linked:", isLinked);
      return { exists: true, isLinked, tenant: existingTenant };
    }

    return { exists: false, isLinked: false };
  };

  const sendInvitation = async ({ email, tenantId }: InvitationData) => {
    setIsLoading(true);
    
    try {
      console.log("Starting invitation process for:", email, "tenant:", tenantId);
      
      // Vérifier d'abord si un utilisateur/tenant existe déjà
      const userCheck = await checkExistingUser(email);
      
      if (userCheck.exists) {
        if (userCheck.isLinked) {
          toast({
            title: "Utilisateur déjà lié",
            description: "Ce locataire a déjà un compte actif dans le système.",
            variant: "destructive",
          });
          return { success: false, error: "User already linked" };
        } else {
          toast({
            title: "Invitation déjà envoyée",
            description: "Une invitation a déjà été envoyée à cette adresse email.",
            variant: "destructive",
          });
          return { success: false, error: "Invitation already sent" };
        }
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

      console.log("Invitation URL:", invitationUrl);

      toast({
        title: "Invitation envoyée",
        description: `Invitation envoyée à ${email}. Le lien d'invitation: ${invitationUrl}`,
      });

      return { 
        success: true, 
        invitation,
        invitationUrl 
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
    checkExistingUser,
    isLoading
  };
};
