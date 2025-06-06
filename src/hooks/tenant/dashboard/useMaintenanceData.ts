
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MaintenanceRequest } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const useMaintenanceData = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadUpdates, setHasUnreadUpdates] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMaintenanceRequests = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching maintenance requests for user:", user.id);
      
      // Fetch tenant data to get the tenant_id
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      if (tenantError) {
        console.error('Error fetching tenant data:', tenantError);
        setMaintenanceRequests([]);
        setIsLoading(false);
        return;
      }

      const tenantId = tenantData?.id;
      if (!tenantId) {
        console.log('No tenant found for user:', user.id);
        setMaintenanceRequests([]);
        setIsLoading(false);
        return;
      }
      
      console.log("Found tenant ID:", tenantId);
      
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching maintenance requests:", error);
        throw error;
      }
      
      console.log("Maintenance requests fetched:", data);
      
      // Check for unread/unnotified updates
      const hasUnnotified = data?.some(req => req.tenant_notified === false);
      setHasUnreadUpdates(hasUnnotified || false);
      
      setMaintenanceRequests(data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      setMaintenanceRequests([]);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de maintenance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Configure Realtime subscription pour les mises à jour de maintenance
  useEffect(() => {
    if (!user) return;
    
    // Fetch initial data
    fetchMaintenanceRequests();
    
    // Set up realtime subscription for maintenance_requests
    const channel = supabase
      .channel('tenant-maintenance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests',
        },
        (payload) => {
          console.log('Maintenance request updated:', payload);
          
          // Check if this request belongs to the current tenant
          if (payload.new && 'tenant_id' in payload.new) {
            // Show toast notification for status updates
            if (payload.eventType === 'UPDATE' && 
                payload.old && 
                payload.new.status !== payload.old.status) {
              toast({
                title: "Demande de maintenance mise à jour",
                description: `La demande "${payload.new.issue}" est maintenant "${payload.new.status}"`,
              });
            }
            
            // Refresh all maintenance requests to get latest data
            fetchMaintenanceRequests();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications',
        },
        (payload) => {
          console.log('New tenant communication:', payload);
          fetchMaintenanceRequests();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    maintenanceRequests,
    isLoading,
    hasUnreadUpdates,
    fetchMaintenanceRequests
  };
};
