import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { MaintenanceRequest } from "@/types/tenant";

export const useMaintenanceRequests = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenantId, setTenantId] = useState<string>("");
  const { toast } = useToast();

  const fetchRequests = async () => {
    console.log("Fetching maintenance requests...");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      console.log("No user found");
      return;
    }

    const { data: tenantData, error: tenantError } = await supabase
      .from("tenants")
      .select("id")
      .eq("tenant_profile_id", userData.user.id)
      .maybeSingle();

    if (tenantError) {
      console.error("Error fetching tenant:", tenantError);
      toast({
        title: "Error",
        description: "Failed to load tenant information",
        variant: "destructive",
      });
      return;
    }

    if (!tenantData) {
      console.log("No tenant found for user:", userData.user.id);
      toast({
        title: "No Access",
        description: "No tenant profile found for your account",
        variant: "destructive",
      });
      return;
    }

    setTenantId(tenantData.id);

    const { data, error } = await supabase
      .from("maintenance_requests")
      .select("*")
      .eq("tenant_id", tenantData.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching maintenance requests:", error);
      toast({
        title: "Error",
        description: "Failed to load maintenance requests",
        variant: "destructive",
      });
      return;
    }

    console.log("Maintenance requests loaded:", data?.length || 0, "requests");
    setRequests(data || []);
  };

  const handleRequestCreated = () => {
    fetchRequests();
  };

  return {
    requests,
    tenantId,
    fetchRequests,
    handleRequestCreated
  };
};