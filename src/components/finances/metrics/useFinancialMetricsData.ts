
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  occupancyRate: number;
  unpaidRent: number;
}

export function useFinancialMetricsData(propertyId: string | null) {
  return useQuery({
    queryKey: ['financial_metrics', propertyId],
    queryFn: async (): Promise<FinancialData | null> => {
      if (!propertyId) return null;

      // Fetch payments for this property (via tenants)
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id, unit_number')
        .eq('property_id', propertyId);

      const tenantIds = tenants?.map(t => t.id) || [];
      
      // If no tenants, return default data
      if (tenantIds.length === 0) {
        return {
          totalIncome: 0,
          totalExpenses: 0,
          occupancyRate: 0,
          unpaidRent: 0
        };
      }

      // Get total income from tenant payments
      const { data: payments, error: paymentsError } = await supabase
        .from('tenant_payments')
        .select('amount, status, tenant_id')
        .in('tenant_id', tenantIds);
      
      if (paymentsError) throw paymentsError;
      
      // Get expenses for this property
      const { data: expenses, error: expensesError } = await supabase
        .from('maintenance_expenses')
        .select('amount')
        .eq('property_id', propertyId);
      
      if (expensesError) throw expensesError;
      
      // Get property details to calculate occupancy rate
      const { data: property } = await supabase
        .from('properties')
        .select('units')
        .eq('id', propertyId)
        .single();
      
      const totalIncome = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      
      // Calculate occupancy rate (number of units with tenants / total units)
      const totalUnits = property?.units || 0;
      const occupiedUnits = new Set(tenants?.map(t => t.unit_number)).size;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
      
      // Calculate unpaid rent (payments with status 'pending' or 'overdue')
      const unpaidRent = payments
        ?.filter(payment => payment.status === 'pending' || payment.status === 'overdue')
        .reduce((sum, payment) => sum + payment.amount, 0) || 0;
      
      return {
        totalIncome,
        totalExpenses,
        occupancyRate,
        unpaidRent
      };
    },
    enabled: !!propertyId
  });
}
