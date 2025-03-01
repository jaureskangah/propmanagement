
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MaintenanceRequest } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";

export const useMaintenanceRequests = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchRequests = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("tenant_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      
      console.log("Fetched maintenance requests:", data);
      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching maintenance requests:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("Found tenant ID:", user.id);
      fetchRequests();
    }
  }, [user]);

  return {
    requests,
    isLoading,
    error,
    fetchRequests
  };
};
