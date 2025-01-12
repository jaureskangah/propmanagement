import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { MaintenanceRequest } from "@/types/tenant";

export const useMaintenanceRequests = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenantId, setTenantId] = useState<string>("");
  const { toast } = useToast();

  const fetchRequests = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: tenantData, error: tenantError } = await supabase
      .from("tenants")
      .select("id")
      .eq("tenant_profile_id", userData.user.id)
      .single();

    if (tenantError || !tenantData) {
      console.error("Error fetching tenant:", tenantError);
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