
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

  useEffect(() => {
    fetchMaintenanceRequests();
  }, [user]);

  return {
    maintenanceRequests,
    isLoading,
    fetchMaintenanceRequests
  };
};
