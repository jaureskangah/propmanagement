
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MaintenanceRequest } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useMaintenanceData = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();

  // Statistics based on current requests
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === "Pending").length;
  const resolvedRequests = requests.filter(r => r.status === "Resolved").length;

  const fetchTenantId = async () => {
    try {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', session?.user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (tenant) {
        console.log("Found tenant ID:", tenant.id);
        setTenantId(tenant.id);
      } else {
        console.log("No tenant found for user:", session?.user?.id);
        toast({
          title: t('error'),
          description: t('notLinkedToTenant'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
      toast({
        title: t('error'),
        description: t('errorLoadingTenant'),
        variant: "destructive",
      });
    }
  };

  const fetchMaintenanceRequests = async () => {
    if (!tenantId) return;
    
    try {
      console.log("Fetching maintenance requests for tenant ID:", tenantId);
      
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched maintenance requests:", data);
      setRequests(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast({
        title: t('error'),
        description: t('errorLoadingRequests'),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!tenantId) return;
    
    const channel = supabase
      .channel('maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          console.log("Realtime notification received:", payload);
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            toast({
              title: t('maintenanceNotification'),
              description: `${t('maintenanceRequestTitle')} "${payload.new.issue}" ${t('statusChanged')} ${payload.new.status}`,
            });
          }
          fetchMaintenanceRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    if (session?.user) {
      fetchTenantId();
    }
  }, [session?.user]);

  useEffect(() => {
    if (tenantId) {
      fetchMaintenanceRequests();
      const unsubscribe = setupRealtimeSubscription();
      return unsubscribe;
    }
  }, [tenantId]);

  return {
    requests,
    tenantId,
    isLoading,
    totalRequests,
    pendingRequests,
    resolvedRequests,
    fetchMaintenanceRequests
  };
};
