
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFinancialOverviewData = (propertyId: string | null) => {
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
    queryKey: ['financial_payments', propertyId],
    queryFn: async () => {
      if (!propertyId || !tenants?.length) return [];
      
      const tenantIds = tenants.map(t => t.id);
      
      const { data, error } = await supabase
        .from('tenant_payments')
        .select('id, amount, payment_date, status, tenant_id')
        .in('tenant_id', tenantIds)
        .order('payment_date', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId && !!tenants?.length
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['financial_expenses', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      const { data, error } = await supabase
        .from('maintenance_expenses')
        .select('id, amount, date, category, description')
        .eq('property_id', propertyId)
        .order('date', { ascending: false });
        
      if (error) throw error;
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
