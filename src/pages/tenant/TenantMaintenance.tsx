import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";
import { TenantMaintenanceView } from "@/components/tenant/maintenance/TenantMaintenanceView";

const TenantMaintenance = () => {
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
    setupRealtimeSubscription();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: tenantData } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', userData.user.id)
        .single();

      if (!tenantData) return;

      const { data: requests } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenantData.id);

      if (requests) {
        setMetrics({
          total: requests.length,
          pending: requests.filter(r => r.status === 'Pending').length,
          resolved: requests.filter(r => r.status === 'Resolved').length
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load maintenance metrics",
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('maintenance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests'
        },
        () => {
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Maintenance Requests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MaintenanceMetrics
          total={metrics.total}
          pending={metrics.pending}
          resolved={metrics.resolved}
        />
      </div>

      <TenantMaintenanceView />
    </div>
  );
};

export default TenantMaintenance;