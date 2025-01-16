import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AddMaintenanceDialog } from "@/components/tenant/maintenance/AddMaintenanceDialog";
import { MaintenanceMetricsSection } from "@/components/tenant/maintenance/components/MaintenanceMetricsSection";
import { MaintenanceContent } from "@/components/tenant/maintenance/components/MaintenanceContent";

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

  const fetchTenantData = async () => {
    try {
      console.log("Fetching tenant data...");
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.log("No user found");
        return;
      }

      const { data: tenantData, error } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', userData.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching tenant:', error);
        toast({
          title: "Error",
          description: "Failed to load tenant data",
          variant: "destructive",
        });
        return;
      }

      if (!tenantData) {
        console.log("No tenant found for this user");
        toast({
          title: "No tenant profile found",
          description: "Please contact your property manager to set up your tenant profile",
          variant: "default",
        });
        return;
      }

      console.log("Tenant found:", tenantData);
      setTenantId(tenantData.id);
      await Promise.all([
        fetchMetrics(tenantData.id),
        fetchCommunications(tenantData.id)
      ]);
    } catch (error) {
      console.error('Error in fetchTenantData:', error);
      toast({
        title: "Error",
        description: "Failed to load tenant data",
        variant: "destructive",
      });
    }
  };

  const fetchMetrics = async (tid: string) => {
    try {
      console.log("Fetching metrics for tenant:", tid);
      const { data: requests, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tid);

      if (error) {
        console.error('Error fetching maintenance requests:', error);
        return;
      }

      if (requests) {
        const metrics = {
          total: requests.length,
          pending: requests.filter(r => r.status === 'Pending').length,
          resolved: requests.filter(r => r.status === 'Resolved').length
        };
        console.log("Updated metrics:", metrics);
        setMetrics(metrics);
      }
    } catch (error) {
      console.error('Error in fetchMetrics:', error);
    }
  };

  const fetchCommunications = async (tid: string) => {
    try {
      console.log("Fetching communications for tenant:", tid);
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching communications:', error);
        return;
      }

      console.log("Fetched communications:", data?.length ?? 0, "items");
      setCommunications(data || []);
    } catch (error) {
      console.error('Error in fetchCommunications:', error);
    }
  };

  const handleMaintenanceUpdate = async () => {
    if (tenantId) {
      await fetchMetrics(tenantId);
    }
  };

  if (!tenantId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No tenant profile found. Please contact your property manager to set up your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <MaintenanceMetricsSection metrics={metrics} />
      
      <MaintenanceContent 
        tenantId={tenantId}
        communications={communications}
      />

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