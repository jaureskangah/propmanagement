
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useChartData = (propertyId: string | null, view: 'monthly' | 'yearly') => {
  return useQuery({
    queryKey: ['financial_chart_data', propertyId, view],
    queryFn: async () => {
      if (!propertyId) return [];

      const { data: tenants } = await supabase
        .from('tenants')
        .select('id')
        .eq('property_id', propertyId);

      const tenantIds = tenants?.map(t => t.id) || [];

      const { data: payments } = await supabase
        .from('tenant_payments')
        .select('amount, payment_date, status')
        .in('tenant_id', tenantIds)
        .order('payment_date', { ascending: true });

      const { data: expenses } = await supabase
        .from('maintenance_expenses')
        .select('amount, date, category')
        .eq('property_id', propertyId)
        .order('date', { ascending: true });

      return { payments: payments || [], expenses: expenses || [] };
    },
    enabled: !!propertyId
  });
};
