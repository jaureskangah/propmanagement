import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TenantCommunications as TenantCommunicationsComponent } from "@/components/tenant/TenantCommunications";
import { useToast } from "@/hooks/use-toast";
import type { Communication } from "@/types/tenant";

const TenantCommunications = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [communications, setCommunications] = useState<Communication[]>([]);

  useEffect(() => {
    const fetchTenantData = async () => {
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
          const { data: comms } = await supabase
            .from('tenant_communications')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });

          setCommunications(comms || []);
        }
      } catch (error) {
        console.error('Error fetching tenant data:', error);
        toast({
          title: "Error",
          description: "Failed to load communications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tenantId) {
    return <div>No tenant profile found</div>;
  }

  return (
    <TenantCommunicationsComponent
      communications={communications}
      tenantId={tenantId}
      onCommunicationUpdate={() => {
        // Refresh communications
        window.location.reload();
      }}
    />
  );
};

export default TenantCommunications;