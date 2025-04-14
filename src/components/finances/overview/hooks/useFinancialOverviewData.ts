
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useFinancialOverviewData = (propertyId: string | null, selectedYear: number) => {
  const { t } = useLocale();
  
  const { data: tenants, isLoading: tenantsLoading, error: tenantsError } = useQuery({
    queryKey: ['financial_tenants', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('id, name, unit_number, rent_amount')
          .eq('property_id', propertyId);
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching tenants:", error);
        throw error;
      }
    },
    enabled: !!propertyId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { 
    data: payments, 
    isLoading: paymentsLoading, 
    error: paymentsError,
    refetch: refetchPayments
  } = useQuery({
    queryKey: ['financial_payments', propertyId, selectedYear],
    queryFn: async () => {
      if (!propertyId || !tenants?.length) return [];
      
      try {
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
      } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
      }
    },
    enabled: !!propertyId && !!tenants?.length,
    retry: 2,
    onError: (error) => {
      console.error("Payments fetch error:", error);
    }
  });

  const { 
    data: expenses, 
    isLoading: expensesLoading, 
    error: expensesError,
    refetch: refetchExpenses
  } = useQuery({
    queryKey: ['financial_expenses', propertyId, selectedYear],
    queryFn: async () => {
      if (!propertyId) return [];
      
      try {
        // Create date range for selected year
        const startDate = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
        const endDate = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
        
        console.log(`Fetching expenses for property ${propertyId} between ${startDate} and ${endDate}`);
        
        // First query for maintenance expenses
        const { data: maintenanceExpenses, error: maintenanceError } = await supabase
          .from('maintenance_expenses')
          .select('id, amount, date, category, description')
          .eq('property_id', propertyId)
          .gte('date', startDate)
          .lte('date', endDate);
          
        if (maintenanceError) {
          console.error("Error fetching maintenance expenses:", maintenanceError);
          throw maintenanceError;
        }
        
        // Second query for vendor interventions which also count as expenses
        const { data: vendorInterventions, error: vendorError } = await supabase
          .from('vendor_interventions')
          .select('id, cost, date, title, description')
          .eq('property_id', propertyId)
          .gte('date', startDate)
          .lte('date', endDate);
          
        if (vendorError) {
          console.error("Error fetching vendor interventions:", vendorError);
          throw vendorError;
        }
        
        // Combine both types of expenses 
        const allExpenses = [
          ...(maintenanceExpenses || []),
          ...(vendorInterventions || [])
        ];
        
        console.log(`Total expenses combined: ${allExpenses.length}`);
        return allExpenses;
      } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;
      }
    },
    enabled: !!propertyId,
    retry: 2
  });

  // Determining the overall loading and error state
  const isLoading = tenantsLoading || paymentsLoading || expensesLoading;
  const error = tenantsError || paymentsError || expensesError;

  // Combined refetch function
  const refetch = () => {
    if (tenantsError) return;
    refetchPayments();
    refetchExpenses();
  };

  return {
    tenants,
    payments,
    expenses,
    isLoading,
    error,
    refetch
  };
};
