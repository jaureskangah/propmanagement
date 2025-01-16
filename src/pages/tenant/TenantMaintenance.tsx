import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";
import { AddMaintenanceDialog } from "@/components/tenant/maintenance/AddMaintenanceDialog";
import { TenantCommunications } from "@/components/tenant/TenantCommunications";

const TenantMaintenance = () => {
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Maintenance Portal</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MaintenanceMetrics
          total={metrics.total}
          pending={metrics.pending}
          resolved={metrics.resolved}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Maintenance Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <TenantMaintenanceView />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communications with Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <TenantCommunications />
          </CardContent>
        </Card>
      </div>

      <AddMaintenanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={fetchMetrics}
      />
    </div>
  );
};

export default TenantMaintenance;