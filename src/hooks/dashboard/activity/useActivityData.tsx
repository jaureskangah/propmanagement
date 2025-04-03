
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useTenantActivities() {
  return useQuery({
    queryKey: ["recent_tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });
}

export function usePaymentActivities() {
  return useQuery({
    queryKey: ["recent_payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenant_payments")
        .select(`
          *,
          tenants (
            unit_number
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });
}

export function useMaintenanceActivities() {
  return useQuery({
    queryKey: ["recent_maintenance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });
}
