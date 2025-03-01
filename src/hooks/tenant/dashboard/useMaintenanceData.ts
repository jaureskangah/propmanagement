
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MaintenanceRequest } from "@/types/tenant";

export const useMaintenanceData = (tenantId: string | null) => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  
  useEffect(() => {
    if (tenantId) {
      fetchMaintenanceRequests(tenantId);
    }
  }, [tenantId]);

  const fetchMaintenanceRequests = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setMaintenanceRequests(data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    }
  };

  return {
    maintenanceRequests,
    fetchMaintenanceRequests
  };
};
