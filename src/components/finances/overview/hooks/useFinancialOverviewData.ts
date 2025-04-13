
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFinancialOverviewData = (propertyId: string | null, selectedYear: number) => {
  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['financial_tenants', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, unit_number, rent_amount')
        .eq('property_id', propertyId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['financial_payments', propertyId, selectedYear],
    queryFn: async () => {
      if (!propertyId || !tenants?.length) return [];
      
      const tenantIds = tenants.map(t => t.id);
      
      // Create date range for selected year
      const startDate = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
      const endDate = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('tenant_payments')
        .select('id, amount, payment_date, status, tenant_id')
        .in('tenant_id', tenantIds)
        .gte('payment_date', startDate)
        .lte('payment_date', endDate)
        .order('payment_date', { ascending: false });
        
      if (error) throw error;
      console.log(`Fetched ${data?.length || 0} payments for year ${selectedYear}`);
      return data || [];
    },
    enabled: !!propertyId && !!tenants?.length
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['financial_expenses', propertyId, selectedYear],
    queryFn: async () => {
      if (!propertyId) return [];
      
      // Create date range for selected year
      const startDate = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
      const endDate = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('maintenance_expenses')
        .select('id, amount, date, category, description')
        .eq('property_id', propertyId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
        
      if (error) throw error;
      console.log(`Fetched ${data?.length || 0} expenses for year ${selectedYear}`);
      return data || [];
    },
    enabled: !!propertyId
  });

  return {
    tenants,
    payments,
    expenses,
    isLoading: tenantsLoading || paymentsLoading || expensesLoading
  };
};
