import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { MaintenanceRequest } from "@/types/tenant";

export const useMaintenanceRequests = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      console.log("Fetching maintenance requests...");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      if (!userData.user) {
        console.log("No user found");
        setRequests([]);
        setIsLoading(false);
        return;
      }

      console.log("Fetching tenant data for user:", userData.user.id);
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .select("id")
        .eq("tenant_profile_id", userData.user.id)
        .maybeSingle();

      if (tenantError) {
        console.error("Error fetching tenant:", tenantError);
        throw tenantError;
      }

      if (!tenantData) {
        console.log("No tenant found for user:", userData.user.id);
        setRequests([]);
        setIsLoading(false);
        return;
      }

      console.log("Fetching maintenance requests for tenant:", tenantData.id);
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("tenant_id", tenantData.id)
        .order("created_at", { ascending: false });

      if (maintenanceError) {
        throw maintenanceError;
      }

      console.log("Maintenance requests loaded:", maintenanceData?.length || 0);
      setRequests(maintenanceData || []);
    } catch (err) {
      console.error("Error in fetchRequests:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to load maintenance requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requests,
    isLoading,
    error,
    fetchRequests
  };
};