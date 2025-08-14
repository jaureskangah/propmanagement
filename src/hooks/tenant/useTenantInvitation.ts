
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface TenantData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  properties?: {
    name: string;
  };
}

export const useTenantInvitation = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('invitation');
    if (token) {
      setInvitationToken(token);
      fetchTenantDataFromInvitation(token);
    }
  }, [searchParams]);

  const fetchTenantDataFromInvitation = async (token: string) => {
    try {
      console.log("=== FETCHING TENANT DATA ===");
      console.log("Invitation token:", token);
      
      // Rechercher l'invitation avec ce token
      const { data: invitation, error: invitationError } = await supabase
        .from('tenant_invitations')
        .select(`
          *,
          tenants:tenant_id (
            id,
            name,
            email,
            phone,
            properties:property_id (name)
          )
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (invitationError || !invitation) {
        console.error("Invalid invitation:", invitationError);
        toast({
          title: "Invitation invalide",
          description: "Ce lien d'invitation n'est pas valide ou a expiré.",
          variant: "destructive",
        });
        return;
      }

      console.log("✅ Invitation found:", invitation);
      setTenantData(invitation.tenants as TenantData);
    } catch (error) {
      console.error("Error fetching tenant data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations du locataire.",
        variant: "destructive",
      });
    }
  };

  return {
    tenantData,
    invitationToken,
  };
};
