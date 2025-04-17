
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MaintenanceRequest } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";

export const useMaintenanceData = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchMaintenanceRequests = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMaintenanceRequests(data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
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
          filter: `tenant_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Maintenance request updated:', payload);
          fetchMaintenanceRequests();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications',
          filter: `tenant_id=eq.${user.id}`
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
    fetchMaintenanceRequests
  };
};
