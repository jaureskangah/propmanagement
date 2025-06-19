
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TenantPayment } from "@/types/tenant";

export const useTenantPayments = (tenantId: string) => {
  return useQuery({
    queryKey: ["tenant_payments", tenantId],
    queryFn: async () => {
      console.log("Fetching payments for tenant:", tenantId);
      
      const { data, error } = await supabase
        .from("tenant_payments")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("payment_date", { ascending: false });

      if (error) {
        console.error("Error fetching tenant payments:", error);
        throw error;
      }

      console.log("Fetched payments:", data);
      return data as TenantPayment[];
    },
    enabled: !!tenantId,
  });
};
