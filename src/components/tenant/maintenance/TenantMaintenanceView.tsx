
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceRequest } from "@/types/tenant";
import { useAuth } from '@/components/AuthProvider';
import { MaintenanceList } from "./components/MaintenanceList";
import { AddMaintenanceDialog } from "../maintenance/AddMaintenanceDialog";
import { useLocale } from "@/components/providers/LocaleProvider";

export const TenantMaintenanceView = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();

  useEffect(() => {
    if (session?.user) {
      fetchTenantId();
    }
  }, [session?.user]);

  useEffect(() => {
    if (tenantId) {
      fetchMaintenanceRequests();
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
          title: t('error'),
          description: t('notLinkedToTenant'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
      toast({
        title: t('error'),
        description: t('errorLoadingTenant'),
        variant: "destructive",
      });
    }
  };

  const fetchMaintenanceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched maintenance requests:", data);
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast({
        title: t('error'),
        description: t('errorLoadingRequests'),
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests',
          filter: `tenant_id=eq.${tenantId}`
        },
        () => {
          fetchMaintenanceRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleMaintenanceUpdate = async () => {
    await fetchMaintenanceRequests();
  };

  if (!tenantId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t('notLinkedToTenant')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t('maintenanceRequestTitle')}</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addNewTask')}
        </Button>
      </CardHeader>
      <CardContent>
        <MaintenanceList 
          requests={requests}
          onMaintenanceUpdate={handleMaintenanceUpdate}
        />
      </CardContent>

      <AddMaintenanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        tenantId={tenantId}
        onSuccess={handleMaintenanceUpdate}
      />
    </Card>
  );
};
