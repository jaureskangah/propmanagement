import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Communication } from "@/types/tenant";
import { NewCommunicationDialog } from "@/components/tenant/communications/NewCommunicationDialog";
import { CommunicationsContent } from "@/components/tenant/communications/CommunicationsContent";

const TenantCommunications = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTenantId();
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchCommunications(tenantId);
      setupRealtimeSubscription(tenantId);
    }
  }, [tenantId]);

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

  const setupRealtimeSubscription = (tid: string) => {
    const channel = supabase
      .channel('communications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications',
          filter: `tenant_id=eq.${tid}`
        },
        () => {
          fetchCommunications(tid);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Communications</h1>
        <Button 
          onClick={() => setIsNewMessageOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
        </CardHeader>
        <CardContent>
          <CommunicationsContent
            communications={communications}
            onToggleStatus={() => {}}
            onCommunicationSelect={() => {}}
            onCommunicationUpdate={handleCommunicationUpdate}
          />
        </CardContent>
      </Card>

      <NewCommunicationDialog
        isOpen={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
        newCommData={{ type: "email", subject: "", content: "", category: "general" }}
        onDataChange={() => {}}
        onSubmit={handleCommunicationUpdate}
      />
    </div>
  );
};

export default TenantCommunications;