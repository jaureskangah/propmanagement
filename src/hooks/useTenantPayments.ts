
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TenantPayment } from "@/types/tenant";
import { useEffect } from "react";

export const useTenantPayments = (tenantId: string) => {
  const query = useQuery({
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
    staleTime: 0, // Toujours refetch pour éviter les données obsolètes
    refetchOnWindowFocus: true,
  });

  // Configuration de la synchronisation temps réel
  useEffect(() => {
    if (!tenantId) return;

    console.log("Setting up realtime subscription for tenant payments:", tenantId);
    
    const channel = supabase
      .channel(`tenant_payments_${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_payments',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          console.log("Realtime update for tenant payments:", payload);
          // Invalider et refetch les données
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription for tenant payments");
      supabase.removeChannel(channel);
    };
  }, [tenantId, query]);

  return query;
};
