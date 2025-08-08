import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { RentRollData, TenantWithPayments } from "./types";
import { parseDateSafe } from "@/lib/date";

export const useRentRollData = (propertyId: string) => {
  return useQuery({
    queryKey: ["rent-roll", propertyId],
    queryFn: async () => {
      console.log("Fetching rent roll data for property:", propertyId);
      
      const { data: tenants, error } = await supabase
        .from("tenants")
        .select(`
          *,
          tenant_payments (
            amount,
            status,
            payment_date
          )
        `)
        .eq("property_id", propertyId)
        .order("unit_number");

      if (error) {
        console.error("Error fetching rent roll:", error);
        throw error;
      }

      console.log("Rent roll data fetched:", tenants);
      
      return (tenants as TenantWithPayments[])?.map(tenant => {
        // Get the most recent payment
        const latestPayment = tenant.tenant_payments
          ?.sort((a, b) => parseDateSafe(b.payment_date).getTime() - parseDateSafe(a.payment_date).getTime())[0];

        return {
          name: tenant.name,
          unit: tenant.unit_number,
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