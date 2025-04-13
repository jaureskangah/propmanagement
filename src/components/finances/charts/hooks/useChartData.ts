
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

export const useChartData = (propertyId: string | null, view: 'monthly' | 'yearly', selectedYear: number) => {
  return useQuery<ChartDataResult>({
    queryKey: ['financial_chart_data', propertyId, view, selectedYear],
    queryFn: async () => {
      if (!propertyId) return { payments: [], expenses: [] };

      console.log(`Fetching ${view} chart data for property:`, propertyId, `year:`, selectedYear);

      // Calculate date range based on selected year
      const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0]; // Jan 1
      const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0]; // Dec 31

      // Fetch tenants for the property
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id')
        .eq('property_id', propertyId);

      const tenantIds = tenants?.map(t => t.id) || [];
      
      // Fetch payments for these tenants in the selected year
      const { data: payments } = await supabase
        .from('tenant_payments')
        .select('amount, payment_date, status')
        .in('tenant_id', tenantIds)
        .gte('payment_date', startOfYear)
        .lte('payment_date', endOfYear)
        .order('payment_date', { ascending: true });

      // Fetch maintenance expenses for the selected year
      const { data: maintenanceExpenses } = await supabase
        .from('maintenance_expenses')
        .select('amount, date, category')
        .eq('property_id', propertyId)
        .gte('date', startOfYear)
        .lte('date', endOfYear)
        .order('date', { ascending: true });
        
      // Fetch vendor interventions for the selected year
      const { data: vendorInterventions } = await supabase
        .from('vendor_interventions')
        .select('cost, date')
        .eq('property_id', propertyId)
        .gte('date', startOfYear)
        .lte('date', endOfYear)
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
      
      console.log(`Chart data fetched for year ${selectedYear}:`, {
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
