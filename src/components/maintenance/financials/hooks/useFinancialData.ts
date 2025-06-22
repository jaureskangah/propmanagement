
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export const useFinancialData = (propertyId: string, selectedYear: number) => {
  useEffect(() => {
    console.log("useFinancialData - params:", { propertyId, selectedYear });
  }, [propertyId, selectedYear]);

  // Fetch expenses data from maintenance_expenses
  const { data: expenses = [], refetch: refetchExpenses } = useQuery({
    queryKey: ["maintenance_expenses", propertyId, selectedYear],
    queryFn: async () => {
      const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
      const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
      
      console.log("Fetching expenses for property:", propertyId, "in date range:", startOfYear, "to", endOfYear);
      
      try {
        const { data, error } = await supabase
          .from("maintenance_expenses")
          .select("*")
          .eq("property_id", propertyId)
          .gte("date", startOfYear)
          .lte("date", endOfYear)
          .order("date", { ascending: false });
  
        if (error) throw error;
  
        console.log("Fetched expenses:", data);
        return data || [];
      } catch (error) {
        console.error("Error in expenses query:", error);
        return [];
      }
    },
    enabled: !!propertyId
  });

  // Fetch maintenance interventions from vendor_interventions
  const { data: maintenance = [], refetch: refetchMaintenance } = useQuery({
    queryKey: ["vendor_interventions", propertyId, selectedYear],
    queryFn: async () => {
      const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
      const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
      
      console.log("Fetching interventions for property:", propertyId, "in date range:", startOfYear, "to", endOfYear);
      
      const { data, error } = await supabase
        .from("vendor_interventions")
        .select(`
          *,
          vendors (
            name,
            specialty
          ),
          properties (
            name
          )
        `)
        .eq("property_id", propertyId)
        .gte("date", startOfYear)
        .lte("date", endOfYear)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching interventions:", error);
        throw error;
      }

      console.log("Fetched interventions:", data);
      return data || [];
    },
    enabled: !!propertyId
  });

  // Fetch rent payments
  const { data: rentData = [] } = useQuery({
    queryKey: ["property_rent_payments", propertyId, selectedYear],
    queryFn: async () => {
      try {
        const { data: tenants, error: tenantsError } = await supabase
          .from("tenants")
          .select("id")
          .eq("property_id", propertyId);
          
        if (tenantsError) throw tenantsError;
        if (!tenants?.length) return [];
        
        const tenantIds = tenants.map(t => t.id);
        const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
        const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
        
        const { data: payments, error: paymentsError } = await supabase
          .from("tenant_payments")
          .select("*")
          .in("tenant_id", tenantIds)
          .gte("payment_date", startOfYear)
          .lte("payment_date", endOfYear);

        if (paymentsError) throw paymentsError;
        return payments || [];
      } catch (error) {
        console.error("Error fetching rent payments:", error);
        return [];
      }
    },
    enabled: !!propertyId
  });

  // Function to refresh all data
  const refreshData = () => {
    refetchExpenses();
    refetchMaintenance();
  };

  return { expenses, maintenance, rentData, refreshData };
};
