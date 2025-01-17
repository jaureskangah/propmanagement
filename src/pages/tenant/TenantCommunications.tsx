import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Communication } from "@/types/tenant";
import { useAuthSession } from "@/hooks/useAuthSession";
import { NewCommunicationDialog } from "@/components/tenant/communications/NewCommunicationDialog";
import { CommunicationsContent } from "@/components/tenant/communications/CommunicationsContent";
import AppSidebar from "@/components/AppSidebar";

const TenantCommunications = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const { session } = useAuthSession();
  const { toast } = useToast();
  const [newCommData, setNewCommData] = useState({
    type: "email",
    subject: "",
    content: "",
    category: "general"
  });

  useEffect(() => {
    if (session?.user) {
      fetchTenantId();
    }
  }, [session?.user]);

  useEffect(() => {
    if (tenantId) {
      fetchCommunications();
      setupRealtimeSubscription();
    }
  }, [tenantId]);

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
          title: "Not linked to a tenant profile",
          description: "Please contact your property manager to link your account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
      toast({
        title: "Error",
        description: "Failed to load tenant information",
        variant: "destructive",
      });
    }
  };

  const fetchCommunications = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched communications:", data);
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
      .channel('communications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications',
          filter: `tenant_id=eq.${tenantId}`
        },
        () => {
          fetchCommunications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCreateCommunication = async () => {
    if (!tenantId) return;

    try {
      const { error } = await supabase
        .from('tenant_communications')
        .insert({
          tenant_id: tenantId,
          type: newCommData.type,
          subject: newCommData.subject,
          content: newCommData.content,
          category: newCommData.category,
          is_from_tenant: true
        });

      if (error) throw error;

      setIsNewMessageOpen(false);
      setNewCommData({ type: "email", subject: "", content: "", category: "general" });
      await fetchCommunications();
      
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error('Error creating communication:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  if (!tenantId) {
    return (
      <div className="flex">
        <AppSidebar isTenant={true} />
        <div className="flex-1 container mx-auto p-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Your account needs to be linked to a tenant profile.
                Please contact your property manager.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-6 space-y-6">
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
              onCommunicationUpdate={fetchCommunications}
            />
          </CardContent>
        </Card>

        <NewCommunicationDialog
          isOpen={isNewMessageOpen}
          onClose={() => setIsNewMessageOpen(false)}
          newCommData={newCommData}
          onDataChange={setNewCommData}
          onSubmit={handleCreateCommunication}
        />
      </div>
    </div>
  );
};

export default TenantCommunications;