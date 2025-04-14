
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

      // Run all queries in parallel for better performance
      try {
        // Run queries concurrently using Promise.all
        const [tenantsResult, paymentsResult, maintenanceExpensesResult, vendorInterventionsResult] = await Promise.all([
          // Fetch tenants for the property
          supabase
            .from('tenants')
            .select('id')
            .eq('property_id', propertyId),
            
          // Prepare payments query (will execute after tenants are fetched)
          supabase
            .from('tenant_payments')
            .select('amount, payment_date, status'),
            
          // Fetch maintenance expenses for the selected year
          supabase
            .from('maintenance_expenses')
            .select('amount, date, category')
            .eq('property_id', propertyId)
            .gte('date', startOfYear)
            .lte('date', endOfYear)
            .order('date', { ascending: true }),
            
          // Fetch vendor interventions for the selected year
          supabase
            .from('vendor_interventions')
            .select('cost, date')
            .eq('property_id', propertyId)
            .gte('date', startOfYear)
            .lte('date', endOfYear)
            .order('date', { ascending: true })
        ]);
        
        const tenantIds = tenantsResult.data?.map(t => t.id) || [];
        
        // If we have tenants, get their payments with a separate query
        let payments = [];
        if (tenantIds.length > 0) {
          const { data: paymentsData, error: paymentsError } = await supabase
            .from('tenant_payments')
            .select('amount, payment_date, status')
            .in('tenant_id', tenantIds)
            .gte('payment_date', startOfYear)
            .lte('payment_date', endOfYear)
            .order('payment_date', { ascending: true });
            
          if (paymentsError) throw paymentsError;
          payments = paymentsData || [];
        }
        
        // Combine both types of expenses
        const allExpenses = [
          ...(maintenanceExpensesResult.data || []).map(expense => ({ 
            amount: expense.amount,
            date: expense.date,
            category: expense.category
          })),
          ...(vendorInterventionsResult.data || []).map(intervention => ({ 
            cost: intervention.cost,
            date: intervention.date
          }))
        ];
        
        console.log(`Chart data fetched for year ${selectedYear}:`, {
          paymentsCount: payments?.length || 0,
          maintenanceExpensesCount: maintenanceExpensesResult.data?.length || 0,
          vendorInterventionsCount: vendorInterventionsResult.data?.length || 0,
          totalExpensesCount: allExpenses.length
        });

        return { 
          payments: payments || [], 
          expenses: allExpenses
        };
        
      } catch (error) {
        console.error("Error in chart data fetch:", error);
        throw error;
      }
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000  // 10 minutes garbage collection
  });
};
