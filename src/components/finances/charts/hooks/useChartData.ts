
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { processMonthlyData, processYearlyData } from "../utils/chartProcessing";
import { useState, useEffect } from "react";

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
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const result = useQuery<ChartDataResult>({
    queryKey: ['financial_chart_data', propertyId, view, selectedYear],
    queryFn: async () => {
      // Security check: Verify authentication before fetching financial data
      if (!isAuthenticated || !user) {
        throw new Error("Authentication required");
      }

      if (!propertyId) return { payments: [], expenses: [] };

      console.log(`Fetching ${view} chart data for property:`, propertyId, `year:`, selectedYear);

      // Calculate date range based on selected year
      const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0]; // Jan 1
      const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0]; // Dec 31

      try {
        // Run queries concurrently using Promise.all
        const [tenantsResult, maintenanceExpensesResult, vendorInterventionsResult] = await Promise.all([
          // Fetch tenants for the property
          supabase
            .from('tenants')
            .select('id')
            .eq('property_id', propertyId),
            
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
        
        // Validate database responses
        if (tenantsResult.error) throw new Error(tenantsResult.error.message);
        if (maintenanceExpensesResult.error) throw new Error(maintenanceExpensesResult.error.message);
        if (vendorInterventionsResult.error) throw new Error(vendorInterventionsResult.error.message);
        
        console.log("Tenants result:", tenantsResult.data);
        console.log("Maintenance expenses:", maintenanceExpensesResult.data);
        console.log("Vendor interventions:", vendorInterventionsResult.data);
        
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
            
          if (paymentsError) throw new Error(paymentsError.message);
          
          console.log("Payments data:", paymentsData);
          
          // Security: Validate and sanitize payment data
          payments = (paymentsData || []).map(payment => ({
            amount: Number(payment.amount) || 0,
            payment_date: payment.payment_date || '',
            status: payment.status || 'unknown'
          }));
        }
        
        // Combine both types of expenses with data validation
        const allExpenses = [
          ...(maintenanceExpensesResult.data || []).map(expense => ({ 
            amount: Number(expense.amount) || 0,
            date: expense.date || '',
            category: expense.category || 'uncategorized'
          })),
          ...(vendorInterventionsResult.data || []).map(intervention => ({ 
            cost: Number(intervention.cost) || 0,
            date: intervention.date || ''
          }))
        ];
        
        console.log(`Chart data fetched for year ${selectedYear}:`, {
          paymentsCount: payments?.length || 0,
          maintenanceExpensesCount: maintenanceExpensesResult.data?.length || 0,
          vendorInterventionsCount: vendorInterventionsResult.data?.length || 0,
          totalExpensesCount: allExpenses.length,
          paymentsFirstItem: payments[0],
          expensesFirstItem: allExpenses[0],
        });

        return { 
          payments: payments || [], 
          expenses: allExpenses
        };
        
      } catch (error: any) {
        console.error("Error in chart data fetch:", error);
        
        // Show user-friendly error message
        toast({
          title: t('error'),
          description: t('errorLoadingData'),
          variant: "destructive",
        });
        
        throw error;
      }
    },
    enabled: !!propertyId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000,  // 10 minutes garbage collection
  });

  // Process data whenever raw data or view changes
  useEffect(() => {
    if (result.data) {
      console.log("Processing chart data with:", {
        payments: result.data.payments.length,
        expenses: result.data.expenses.length,
        year: selectedYear,
      });
      
      // Process monthly data
      const monthlyProcessed = processMonthlyData(
        result.data.payments,
        result.data.expenses,
        selectedYear
      );
      console.log("Monthly data processed:", monthlyProcessed);
      setMonthlyData(monthlyProcessed);
      
      // Process yearly data
      const yearlyProcessed = processYearlyData(
        result.data.payments,
        result.data.expenses,
        selectedYear
      );
      console.log("Yearly data processed:", yearlyProcessed);
      setYearlyData(yearlyProcessed);
    }
  }, [result.data, selectedYear]);

  return {
    monthlyData,
    yearlyData,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch
  };
};
