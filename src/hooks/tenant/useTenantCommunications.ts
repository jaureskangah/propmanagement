import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Communication } from "@/types/tenant";

export const useTenantCommunications = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTenantId();
    }
  }, [user]);

  useEffect(() => {
    if (tenantId) {
      fetchCommunications();
      return setupRealtimeSubscription();
    }
  }, [tenantId]);

  const fetchTenantId = async () => {
    try {
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
        toast({
          title: "Not linked to a tenant profile",
          description: "Please contact your property manager to link your account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
      toast({
        title: "Error",
        description: "Failed to load tenant information",
        variant: "destructive",
      });
    }
  };

  const fetchCommunications = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched communications:", data);
      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast({
        title: "Error",
        description: "Failed to load communications",
        variant: "destructive",
      });
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
        () => {
          fetchCommunications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCreateCommunication = async (subject: string, content: string) => {
    if (!tenantId) return;

    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .insert({
          tenant_id: tenantId,
          type: 'message',
          subject,
          content,
          category: 'general',
          is_from_tenant: true
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Message created successfully:", data);

      // Send email notification
      const { error: notificationError } = await supabase.functions.invoke('notify-communication', {
        body: {
          tenantId,
          subject,
          content,
          isFromTenant: true
        }
      });

      if (notificationError) {
        console.error("Error sending notification:", notificationError);
      }

      await fetchCommunications();
      
      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      return true;
    } catch (error) {
      console.error('Error creating communication:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    tenantId,
    communications,
    handleCreateCommunication,
    refreshCommunications: fetchCommunications
  };
};
