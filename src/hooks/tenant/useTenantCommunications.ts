
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Communication } from "@/types/tenant";

export const useTenantCommunications = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tenant, setTenant] = useState<{ email: string; name: string } | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTenantId();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (tenantId) {
      fetchCommunications();
      fetchTenantDetails();
      return setupRealtimeSubscription();
    }
  }, [tenantId]);

  const fetchTenantId = async () => {
    try {
      setIsLoading(true);
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (tenant) {
        console.log("Found tenant ID:", tenant.id);
        setTenantId(tenant.id);
      } else {
        console.log("No tenant found for user:", user?.id);
        setIsLoading(false);
        toast({
          title: "Profil non lié",
          description: "Veuillez contacter votre gestionnaire pour lier votre compte.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations du locataire",
        variant: "destructive",
      });
    }
  };

  const fetchTenantDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('email, name')
        .eq('id', tenantId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setTenant(data);
      }
    } catch (error) {
      console.error('Error fetching tenant details:', error);
    }
  };

  const fetchCommunications = async () => {
    try {
      console.log("Fetching communications for tenant:", tenantId);
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched communications:", data);
      setCommunications(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les communications",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('communications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          console.log("Realtime update received for tenant communications:", payload);
          fetchCommunications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCreateCommunication = async (subject: string, content: string, category: string = 'general') => {
    if (!tenantId) return false;

    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .insert({
          tenant_id: tenantId,
          type: 'message',
          subject,
          content,
          category,
          is_from_tenant: true,
          status: 'unread'
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Message created successfully:", data);
      await fetchCommunications();
      
      toast({
        title: "Succès",
        description: "Message envoyé avec succès",
      });

      return true;
    } catch (error) {
      console.error('Error creating communication:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    tenantId,
    communications,
    handleCreateCommunication,
    refreshCommunications: fetchCommunications,
    isLoading,
    tenant
  };
};
