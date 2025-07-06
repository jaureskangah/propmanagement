
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFinancialOverviewData = (propertyId: string | null, selectedYear: number) => {
  // Fetch tenants for the property
  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ["financial_tenants", propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      const { data, error } = await supabase
        .from("tenants")
        .select("id, name, unit_number, rent_amount")
        .eq("property_id", propertyId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId,
    staleTime: 30 * 1000, // 30 secondes pour une mise à jour rapide
    gcTime: 5 * 60 * 1000,
  });

  // Fetch payments for those tenants for the selected year
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["financial_payments", propertyId, selectedYear],
    queryFn: async () => {
      if (!propertyId || !tenants.length) return [];
      
      const tenantIds = tenants.map(t => t.id);
      const { data, error } = await supabase
        .from("tenant_payments")
        .select("*")
        .in("tenant_id", tenantIds)
        .gte("payment_date", `${selectedYear}-01-01`)
        .lte("payment_date", `${selectedYear}-12-31`)
        .order("payment_date", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId && tenants.length > 0,
    staleTime: 30 * 1000, // 30 secondes pour une mise à jour rapide
    gcTime: 5 * 60 * 1000,
  });

  // Fetch expenses for the property for the selected year
  const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["financial_expenses", propertyId, selectedYear],
    queryFn: async () => {
      if (!propertyId) return [];
      
      // Fetch maintenance expenses
      const { data: maintenanceExpenses, error: maintenanceError } = await supabase
        .from("maintenance_expenses")
        .select(`
          *,
          vendors (
            name
          )
        `)
        .eq("property_id", propertyId)
        .gte("date", `${selectedYear}-01-01`)
        .lte("date", `${selectedYear}-12-31`)
        .order("date", { ascending: false });
      
      if (maintenanceError) throw maintenanceError;
      
      // Fetch vendor interventions
      const { data: vendorInterventions, error: vendorError } = await supabase
        .from("vendor_interventions")
        .select(`
          *,
          vendors (
            name,
            specialty
          )
        `)
        .eq("property_id", propertyId)
        .gte("date", `${selectedYear}-01-01`)
        .lte("date", `${selectedYear}-12-31`)
        .order("date", { ascending: false });
      
      if (vendorError) throw vendorError;
      
      // Combine both types of expenses
      const allExpenses = [
        ...(maintenanceExpenses || []).map(expense => ({
          ...expense,
          type: 'maintenance' as const
        })),
        ...(vendorInterventions || []).map(intervention => ({
          ...intervention,
          amount: intervention.cost,
          type: 'intervention' as const
        }))
      ];
      
      return allExpenses;
    },
    enabled: !!propertyId,
    staleTime: 30 * 1000, // 30 secondes pour une mise à jour rapide
    gcTime: 5 * 60 * 1000,
  });

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingExpenses;
  const error = null; // Les erreurs sont gérées individuellement par chaque query

  const refetch = async () => {
    // Cette fonction pourrait être utilisée pour forcer un refetch manuel si nécessaire
    console.log("Manual refetch triggered for financial overview data");
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
