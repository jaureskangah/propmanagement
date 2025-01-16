import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { NewCommunicationDialog } from "@/components/tenant/communications/NewCommunicationDialog";
import { CommunicationsList } from "@/components/tenant/communications/CommunicationsList";
import { useCommunicationState } from "@/hooks/communications/useCommunicationState";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";

const TenantCommunications = () => {
  const [communications, setCommunications] = useState([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { toast } = useToast();
  const {
    isNewCommDialogOpen,
    setIsNewCommDialogOpen,
    newCommData,
    setNewCommData
  } = useCommunicationState();
  const { handleCreateCommunication } = useCommunicationActions(tenantId || undefined);

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

  const handleCreateSubmit = async () => {
    if (!tenantId) return;
    
    const success = await handleCreateCommunication(newCommData);
    if (success) {
      setIsNewCommDialogOpen(false);
      setNewCommData({ type: "email", subject: "", content: "", category: "general" });
      fetchCommunications(tenantId);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Communications</h1>
        <Button 
          onClick={() => setIsNewCommDialogOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <CommunicationsList 
            communications={communications}
            onCommunicationUpdate={() => tenantId && fetchCommunications(tenantId)}
          />
        </CardContent>
      </Card>

      <NewCommunicationDialog
        isOpen={isNewCommDialogOpen}
        onClose={() => setIsNewCommDialogOpen(false)}
        newCommData={newCommData}
        onDataChange={setNewCommData}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};

export default TenantCommunications;