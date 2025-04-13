
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface ChartDataResult {
  payments: Array<{
    amount: number;
    payment_date: string;
    status: string;
  }>;
  expenses: Array<{
    amount?: number;
    cost?: number;
    date: string;
    category?: string;
  }>;
}

export const useChartData = (propertyId: string | null, view: 'monthly' | 'yearly') => {
  return useQuery<ChartDataResult>({
    queryKey: ['financial_chart_data', propertyId, view],
    queryFn: async () => {
      if (!propertyId) return { payments: [], expenses: [] };

      console.log(`Fetching ${view} chart data for property:`, propertyId);

      // Fetch tenants for the property
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id')
        .eq('property_id', propertyId);

      const tenantIds = tenants?.map(t => t.id) || [];
      
      // Fetch payments for these tenants
      const { data: payments } = await supabase
        .from('tenant_payments')
        .select('amount, payment_date, status')
        .in('tenant_id', tenantIds)
        .order('payment_date', { ascending: true });

      // Fetch maintenance expenses
      const { data: maintenanceExpenses } = await supabase
        .from('maintenance_expenses')
        .select('amount, date, category')
        .eq('property_id', propertyId)
        .order('date', { ascending: true });
        
      // Fetch vendor interventions (also considered expenses)
      const { data: vendorInterventions } = await supabase
        .from('vendor_interventions')
        .select('cost, date')
        .eq('property_id', propertyId)
        .order('date', { ascending: true });
        
      // Combine both types of expenses
      const allExpenses = [
        ...(maintenanceExpenses || []).map(expense => ({ 
          amount: expense.amount,
          date: expense.date,
          category: expense.category
        })),
        ...(vendorInterventions || []).map(intervention => ({ 
          cost: intervention.cost,
          date: intervention.date
        }))
      ];
      
      console.log(`Chart data fetched:`, {
        paymentsCount: payments?.length || 0,
        maintenanceExpensesCount: maintenanceExpenses?.length || 0,
        vendorInterventionsCount: vendorInterventions?.length || 0,
        totalExpensesCount: allExpenses.length
      });

      return { 
        payments: payments || [], 
        expenses: allExpenses
      };
    },
    enabled: !!propertyId
  });
};
