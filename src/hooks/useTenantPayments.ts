
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TenantPayment } from "@/types/tenant";

export const useTenantPayments = (tenantId: string) => {
  return useQuery({
    queryKey: ["tenant_payments", tenantId],
    queryFn: async () => {
      console.log("useTenantPayments - Fetching payments for tenant:", tenantId);
      console.log("useTenantPayments - TenantId type:", typeof tenantId);
      console.log("useTenantPayments - TenantId length:", tenantId?.length);
      
      if (!tenantId) {
        console.log("useTenantPayments - No tenantId provided, returning empty array");
        return [];
      }
      
      const { data, error } = await supabase
        .from("tenant_payments")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("payment_date", { ascending: false });

      if (error) {
        console.error("useTenantPayments - Error fetching tenant payments:", error);
        throw error;
      }

      console.log("useTenantPayments - Fetched payments:", data);
      console.log("useTenantPayments - Number of payments:", data?.length || 0);
      return data as TenantPayment[];
    },
    enabled: !!tenantId,
  });
};
