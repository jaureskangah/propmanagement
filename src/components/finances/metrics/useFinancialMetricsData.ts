
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  roi: number;
}

export function useFinancialMetricsData(propertyId: string | null) {
  return useQuery({
    queryKey: ['financial_metrics', propertyId],
    queryFn: async (): Promise<FinancialData | null> => {
      if (!propertyId) return null;

      // Fetch payments for this property (via tenants)
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id')
        .eq('property_id', propertyId);

      const tenantIds = tenants?.map(t => t.id) || [];
      
      // If no tenants, return default data
      if (tenantIds.length === 0) {
        return {
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          roi: 0
        };
      }

      // Get total income from tenant payments
      const { data: payments, error: paymentsError } = await supabase
        .from('tenant_payments')
        .select('amount, tenant_id')
        .in('tenant_id', tenantIds);
      
      if (paymentsError) throw paymentsError;
      
      // Get expenses for this property
      const { data: expenses, error: expensesError } = await supabase
        .from('maintenance_expenses')
        .select('amount')
        .eq('property_id', propertyId);
      
      if (expensesError) throw expensesError;
      
      // Get property value (for ROI calculation) - approximated at 20x annual rent
      const { data: property } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      const totalIncome = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      const netIncome = totalIncome - totalExpenses;
      
      // Calculate approximate ROI (simplified)
      // For a real app, you would need actual property value data
      const propertyValue = property ? (totalIncome * 20) : 100000; // Approximation
      const roi = propertyValue > 0 ? (netIncome / propertyValue) * 100 : 0;
      
      return {
        totalIncome,
        totalExpenses,
        netIncome,
        roi
      };
    },
    enabled: !!propertyId
  });
}
