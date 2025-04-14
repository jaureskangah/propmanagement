
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
      
      try {
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
        
        console.log("Maintenance expenses fetched:", maintenanceExpenses);
        
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
        
        console.log("Vendor interventions fetched:", vendorInterventions);
        
        // Combine both types of expenses 
        const allExpenses = [
          ...(maintenanceExpenses || []),
          ...(vendorInterventions || [])
        ];
        
        console.log(`Total expenses combined: ${allExpenses.length}`);
        console.log("Combined expenses data:", allExpenses);
        
        return allExpenses;
      } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;
      }
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
