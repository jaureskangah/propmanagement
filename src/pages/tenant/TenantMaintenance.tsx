import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";
import { AddMaintenanceDialog } from "@/components/tenant/maintenance/AddMaintenanceDialog";
import { TenantMaintenanceView } from "@/components/tenant/maintenance/TenantMaintenanceView";
import { TenantCommunications } from "@/components/tenant/TenantCommunications";
import type { MaintenanceRequest } from "@/types/tenant";

const TenantMaintenance = () => {
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");
  const [communications, setCommunications] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTenantData();
  }, []);

  const fetchTenantData = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: tenantData } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', userData.user.id)
        .single();

      if (!tenantData) return;

      setTenantId(tenantData.id);
      await Promise.all([
        fetchMetrics(tenantData.id),
        fetchCommunications(tenantData.id)
      ]);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      toast({
        title: "Error",
        description: "Failed to load tenant data",
        variant: "destructive",
      });
    }
  };

  const fetchMetrics = async (tid: string) => {
    try {
      const { data: requests } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tid);

      if (requests) {
        setMetrics({
          total: requests.length,
          pending: requests.filter(r => r.status === 'Pending').length,
          resolved: requests.filter(r => r.status === 'Resolved').length
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchCommunications = async (tid: string) => {
    try {
      const { data } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tid)
        .order('created_at', { ascending: false });

      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
    }
  };

  const handleMaintenanceUpdate = async () => {
    if (tenantId) {
      await fetchMetrics(tenantId);
    }
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
            <TenantCommunications 
              communications={communications}
              tenantId={tenantId}
            />
          </CardContent>
        </Card>
      </div>

      <AddMaintenanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleMaintenanceUpdate}
        tenantId={tenantId}
      />
    </div>
  );
};

export default TenantMaintenance;