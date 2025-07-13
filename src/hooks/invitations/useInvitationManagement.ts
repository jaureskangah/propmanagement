
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

type Invitation = {
  id: string;
  email: string;
  tenant_id: string;
  status: string;
  created_at: string;
  expires_at: string;
  tenant_name?: string;
  property_name?: string;
}

export const useInvitationManagement = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingInvitations, setSendingInvitations] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenant_invitations')
        .select(`
          *,
          tenants:tenant_id (
            name,
            tenant_profile_id,
            properties (name)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Vérifier et corriger automatiquement les invitations qui devraient être acceptées
      const pendingInvitations = data.filter(invitation => 
        invitation.status === 'pending' && 
        invitation.tenants?.tenant_profile_id !== null
      );

      if (pendingInvitations.length > 0) {
        console.log(`🔄 Found ${pendingInvitations.length} pending invitations that should be accepted`);
        
        // Mettre à jour automatiquement ces invitations
        const invitationIds = pendingInvitations.map(inv => inv.id);
        const { error: updateError } = await supabase
          .from('tenant_invitations')
          .update({ status: 'accepted' })
          .in('id', invitationIds);

        if (updateError) {
          console.error("❌ Error auto-updating invitation statuses:", updateError);
        } else {
          console.log("✅ Auto-updated invitation statuses for signed-up tenants");
          
          // Refaire la requête pour récupérer les données mises à jour
          const { data: updatedData, error: refetchError } = await supabase
            .from('tenant_invitations')
            .select(`
              *,
              tenants:tenant_id (
                name,
                tenant_profile_id,
                properties (name)
              )
            `)
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

          if (!refetchError && updatedData) {
            data.splice(0, data.length, ...updatedData);
          }
        }
      }

      const transformedData = data.map(invitation => ({
        ...invitation,
        tenant_name: invitation.tenants?.name || 'Unknown',
        property_name: invitation.tenants?.properties?.name || 'Unknown'
      }));
      
      setInvitations(transformedData);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les invitations',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvitation = async (invitation: Invitation) => {
    setSendingInvitations(prev => new Set(prev).add(invitation.id));
    
    try {
      console.log("Resending invitation for:", invitation.email, "to tenant ID:", invitation.tenant_id);
      
      const newToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase
        .from('tenant_invitations')
        .update({
          token: newToken,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        })
        .eq('id', invitation.id);

      if (error) throw error;
      
      console.log("Invitation updated successfully, now sending email");
      
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('name, email')
        .eq('id', invitation.tenant_id)
        .single();

      if (tenantError) {
        console.error("Error fetching tenant data:", tenantError);
        throw new Error("Impossible de récupérer les données du locataire");
      }
      
      toast({
        title: "Envoi en cours",
        description: `Envoi de l'invitation à ${invitation.email}...`,
      });
      
      try {
        console.log("Calling send-tenant-email edge function");
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-tenant-email', {
          body: {
            tenantId: invitation.tenant_id,
            subject: "Nouvelle invitation à rejoindre l'espace locataire",
            content: `
              <p>Bonjour ${tenantData.name},</p>
              <p>Vous avez reçu une nouvelle invitation à rejoindre l'espace locataire de votre propriété.</p>
              <p>Pour créer votre compte et accéder à vos informations, veuillez cliquer sur le lien ci-dessous :</p>
              <p><a href="${window.location.origin}/tenant-signup?invitation=${newToken}">Créer mon compte</a></p>
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
            title: "Erreur d'envoi",
            description: "L'invitation a été mise à jour mais l'email n'a pas pu être envoyé automatiquement",
            variant: "destructive",
          });
          return;
        }
        
        console.log("Email sent successfully");
        
        toast({
          title: "Invitation envoyée avec succès",
          description: `L'invitation a été envoyée à ${invitation.email}`,
        });
      } catch (emailError: any) {
        console.error("Error in resend email process:", emailError);
        
        toast({
          title: "Erreur d'envoi",
          description: "L'invitation a été mise à jour mais l'email n'a pas pu être envoyé",
          variant: "destructive",
        });
        return;
      }

      fetchInvitations();
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'invitation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSendingInvitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitation.id);
        return newSet;
      });
    }
  };

  const handleCancelInvitation = async (invitation: Invitation) => {
    try {
      const { error } = await supabase
        .from('tenant_invitations')
        .update({
          status: 'cancelled'
        })
        .eq('id', invitation.id);

      if (error) throw error;

      toast({
        title: "Invitation annulée",
        description: "L'invitation a été annulée avec succès",
      });

      fetchInvitations();
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler l'invitation. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchInvitations();
      
      // Set up real-time subscription to get updates
      const channel = supabase
        .channel('tenant_invitations_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tenant_invitations',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Invitation change detected:', payload);
            fetchInvitations(); // Refresh data when changes occur
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    invitations,
    isLoading,
    sendingInvitations,
    handleResendInvitation,
    handleCancelInvitation,
    fetchInvitations
  };
};
