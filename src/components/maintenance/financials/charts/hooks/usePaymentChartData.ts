
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

export const usePaymentChartData = (propertyId: string) => {
  return useQuery({
    queryKey: ["property_payments", propertyId],
    queryFn: async () => {
      console.log("Fetching payment data for property:", propertyId);
      
      // First get all tenants for this property
      const { data: tenants, error: tenantsError } = await supabase
        .from("tenants")
        .select("id")
        .eq("property_id", propertyId);

      if (tenantsError) {
        console.error("Error fetching tenants:", tenantsError);
        throw tenantsError;
      }

      if (!tenants?.length) return [];

      const tenantIds = tenants.map(t => t.id);
      
      // Then get all payments for these tenants
      const { data: payments, error: paymentsError } = await supabase
        .from("tenant_payments")
        .select("amount, payment_date, status")
        .in("tenant_id", tenantIds)
        .order("payment_date", { ascending: true });

      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        throw paymentsError;
      }

      // Group payments by month and calculate total
      const monthlyPayments = payments?.reduce((acc: any, payment) => {
        const date = format(parseISO(payment.payment_date), 'MMM yyyy');
        if (!acc[date]) {
          acc[date] = { total: 0, paid: 0, pending: 0, late: 0 };
        }
        acc[date].total += payment.amount;
        
        // Categorize payments
        if (payment.status === 'paid') {
          acc[date].paid += payment.amount;
        } else if (payment.status === 'pending') {
          acc[date].pending += payment.amount;
        } else if (payment.status === 'late') {
          acc[date].late += payment.amount;
        }
        return acc;
      }, {});

      // Convert to array format for Recharts and calculate cumulative totals
      let cumulativeTotal = 0;
      return Object.entries(monthlyPayments || {}).map(([date, data]: [string, any]) => {
        cumulativeTotal += data.paid;
        return {
          date,
          ...data,
          cumulative: cumulativeTotal
        };
      });
    },
  });
};
