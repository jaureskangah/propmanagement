import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Communication } from "@/types/tenant";
import { CommunicationsContent } from "@/components/tenant/communications/CommunicationsContent";
import { useNavigate } from "react-router-dom";
import { TenantMaintenanceView } from "@/components/tenant/maintenance/TenantMaintenanceView";

const TenantMaintenance = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      console.log("Fetching tenant ID...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No authenticated user found");
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      console.log("Fetching tenant data for user:", user.id);
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching tenant:', error);
        toast({
          title: "Error",
          description: "Failed to load tenant information",
          variant: "destructive",
        });
        return;
      }

      if (!tenant) {
        console.log("No tenant profile found for user:", user.id);
        toast({
          title: "Access Denied",
          description: "No tenant profile found for your account",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      console.log("Tenant found:", tenant.id);
      setTenantId(tenant.id);
    } catch (error) {
      console.error('Error in fetchTenantId:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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

      if (error) throw error;
      console.log("Communications loaded:", data?.length || 0);
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
    console.log("Setting up realtime subscription for tenant:", tid);
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
          console.log("Realtime update received, fetching new data");
          fetchCommunications(tid);
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  };

  return (
    <div className="flex">
      {/* Main content */}
      <div className="flex-1 container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Maintenance</h1>
        </div>

        {tenantId ? (
          <TenantMaintenanceView />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You don't have access to maintenance features. Please contact your property manager.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-64 border-l bg-background p-4 space-y-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => navigate('/tenant/maintenance')}
        >
          Maintenance
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => navigate('/tenant/communications')}
        >
          Communications
        </Button>
      </div>
    </div>
  );
};

export default TenantMaintenance;