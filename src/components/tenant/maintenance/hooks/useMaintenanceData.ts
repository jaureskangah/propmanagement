
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MaintenanceRequest } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const useMaintenanceData = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMaintenanceRequests = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("useMaintenanceData - Fetching data for user:", user.id);
      
      // First get the tenant ID
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      if (tenantError) {
        console.error('Error fetching tenant data:', tenantError);
        setTenantId(null);
        setRequests([]);
        setIsLoading(false);
        return;
      }

      const currentTenantId = tenantData?.id;
      console.log("useMaintenanceData - Found tenant ID:", currentTenantId);
      
      if (!currentTenantId) {
        console.log('useMaintenanceData - No tenant found for user:', user.id);
        setTenantId(null);
        setRequests([]);
        setIsLoading(false);
        return;
      }
      
      setTenantId(currentTenantId);
      
      // Then fetch maintenance requests
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', currentTenantId)
        .order('created_at', { ascending: false });

      if (maintenanceError) {
        console.error("Error fetching maintenance requests:", maintenanceError);
        throw maintenanceError;
      }
      
      console.log("useMaintenanceData - Maintenance requests fetched:", maintenanceData);
      setRequests(maintenanceData || []);
      
    } catch (error) {
      console.error('useMaintenanceData - Error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de maintenance",
        variant: "destructive",
      });
      setRequests([]);
      setTenantId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, [user]);

  // Calculate stats
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(req => req.status === 'Pending').length;
  const resolvedRequests = requests.filter(req => req.status === 'Resolved').length;

  return {
    requests,
    tenantId,
    totalRequests,
    pendingRequests,
    resolvedRequests,
    isLoading,
    fetchMaintenanceRequests
  };
};
