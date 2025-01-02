import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { RentRollData, TenantWithPayments } from "./types";

export const useRentRollData = () => {
  return useQuery({
    queryKey: ["rent-roll"],
    queryFn: async () => {
      console.log("Fetching rent roll data...");
      
      const { data: tenants, error } = await supabase
        .from("tenants")
        .select(`
          name,
          rent_amount,
          lease_end,
          tenant_payments!inner (
            amount,
            status,
            payment_date
          )
        `);

      if (error) {
        console.error("Error fetching rent roll:", error);
        throw error;
      }

      console.log("Rent roll data fetched:", tenants);
      
      return (tenants as TenantWithPayments[])?.map(tenant => {
        // Get the most recent payment
        const latestPayment = tenant.tenant_payments
          ?.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())[0];

        return {
          name: tenant.name,
          rent_amount: tenant.rent_amount,
          lease_end: tenant.lease_end,
          lastPayment: latestPayment ? {
            amount: latestPayment.amount,
            date: latestPayment.payment_date,
            status: latestPayment.status
          } : null
        };
      }) || [];
    },
  });
};