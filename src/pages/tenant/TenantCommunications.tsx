import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { CommunicationsContent } from "@/components/tenant/communications/CommunicationsContent";
import { Communication } from "@/types/tenant";
import { useToast } from "@/hooks/use-toast";

const TenantCommunications = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTenantId();
    setupRealtimeSubscription();
  }, []);

  const fetchTenantId = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: tenantData } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', userData.user.id)
        .single();

      if (tenantData) {
        setTenantId(tenantData.id);
        fetchCommunications(tenantData.id);
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
    }
  };

  const fetchCommunications = async (tid: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tid)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      .channel('communications-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications'
        },
        (payload) => {
          if (tenantId) {
            fetchCommunications(tenantId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCommunicationUpdate = async () => {
    if (tenantId) {
      await fetchCommunications(tenantId);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardContent>
          <CommunicationsContent
            communications={communications}
            onToggleStatus={() => {}}
            onCommunicationSelect={() => {}}
            onCommunicationUpdate={handleCommunicationUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantCommunications;