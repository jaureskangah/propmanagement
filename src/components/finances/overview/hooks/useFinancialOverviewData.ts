
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
        toast({
          title: t('error'),
          description: t('errorLoadingData'),
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!propertyId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
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
        
        console.log(`Finances: Fetching payments for property ${propertyId} in date range: ${startDate} to ${endDate}`);
        
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
    staleTime: 3 * 60 * 1000, // 3 minutes cache
    meta: {
      onError: (error: any) => {
        console.error("Payments fetch error:", error);
        toast({
          title: t('error'),
          description: t('errorLoadingData'),
          variant: "destructive",
        });
      }
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
        
        console.log(`Finances: Fetching expenses for property ${propertyId} between ${startDate} and ${endDate}`);
        
        // Run both queries in parallel using Promise.all for better performance
        const [maintenanceResponse, vendorResponse] = await Promise.all([
          // First query for maintenance expenses
          supabase
            .from('maintenance_expenses')
            .select('id, amount, date, category, description')
            .eq('property_id', propertyId)
            .gte('date', startDate)
            .lte('date', endDate),
            
          // Second query for vendor interventions which also count as expenses
          supabase
            .from('vendor_interventions')
            .select('id, cost as amount, date, title as description')  // Normalize field names
            .eq('property_id', propertyId)
            .gte('date', startDate)
            .lte('date', endDate)
        ]);
        
        if (maintenanceResponse.error) {
          console.error("Error fetching maintenance expenses:", maintenanceResponse.error);
          throw maintenanceResponse.error;
        }
        
        if (vendorResponse.error) {
          console.error("Error fetching vendor interventions:", vendorResponse.error);
          throw vendorResponse.error;
        }
        
        // Normaliser les données pour assurer la cohérence
        const maintenanceExpenses = maintenanceResponse.data || [];
        
        // Normaliser les interventions de vendeurs pour qu'elles utilisent le même format que les dépenses de maintenance
        const vendorExpenses = (vendorResponse.data || []).map(item => ({
          ...item,
          category: 'vendor_intervention',
          // Assurez-vous que le coût est bien normalisé à 'amount' pour la cohérence
          amount: item.amount || 0
        }));
        
        // Combine both types of expenses 
        const allExpenses = [
          ...maintenanceExpenses,
          ...vendorExpenses
        ];
        
        console.log(`Finances: Total expenses combined: ${allExpenses.length}`, {
          maintenanceExpenses: maintenanceExpenses.length,
          vendorExpenses: vendorExpenses.length
        });
        return allExpenses;
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast({
          title: t('error'),
          description: t('errorLoadingData'),
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!propertyId,
    retry: 2,
    staleTime: 3 * 60 * 1000, // 3 minutes cache
  });

  // Determining the overall loading and error state
  const isLoading = tenantsLoading || paymentsLoading || expensesLoading;
  const error = tenantsError || paymentsError || expensesError;

  // Combined refetch function with debounce to prevent multiple refreshes
  const refetch = () => {
    if (tenantsError) return;
    
    // Use setTimeout to ensure we don't trigger multiple refetches in the same cycle
    setTimeout(() => {
      refetchPayments();
      refetchExpenses();
    }, 0);
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
