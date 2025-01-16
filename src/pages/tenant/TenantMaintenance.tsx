import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TenantMaintenanceView } from "@/components/tenant/maintenance/TenantMaintenanceView";
import { useToast } from "@/hooks/use-toast";

const TenantMaintenance = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenantId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: tenant } = await supabase
          .from('tenants')
          .select('id')
          .eq('tenant_profile_id', user.id)
          .single();

        if (tenant) {
          setTenantId(tenant.id);
        }
      } catch (error) {
        console.error('Error fetching tenant data:', error);
        toast({
          title: "Error",
          description: "Failed to load maintenance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenantId();
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tenantId) {
    return <div>No tenant profile found</div>;
  }

  return <TenantMaintenanceView />;
};

export default TenantMaintenance;