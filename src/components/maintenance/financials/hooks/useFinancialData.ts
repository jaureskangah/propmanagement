
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFinancialData = (propertyId: string, selectedYear: number) => {
  console.log("useFinancialData appelé avec propertyId:", propertyId, "et année:", selectedYear);

  const { data: expenses = [], isLoading: expensesLoading, refetch: refetchExpenses } = useQuery({
    queryKey: ["maintenance_expenses", propertyId, selectedYear],
    queryFn: async () => {
      if (!propertyId) {
        console.log("Pas de propertyId, retour d'un tableau vide");
        return [];
      }

      console.log("Récupération des dépenses pour propertyId:", propertyId, "année:", selectedYear);
      const { data, error } = await supabase
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

      if (error) {
        console.error("Erreur lors de la récupération des dépenses:", error);
        throw error;
      }

      console.log("Dépenses récupérées:", data?.length || 0, "éléments pour l'année", selectedYear);
      return data || [];
    },
    enabled: !!propertyId,
  });

  const { data: maintenance = [], isLoading: maintenanceLoading, refetch: refetchMaintenance } = useQuery({
    queryKey: ["vendor_interventions", propertyId, selectedYear],
    queryFn: async () => {
      if (!propertyId) {
        console.log("Pas de propertyId pour les interventions, retour d'un tableau vide");
        return [];
      }

      console.log("Récupération des interventions pour propertyId:", propertyId, "année:", selectedYear);
      const { data, error } = await supabase
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

      if (error) {
        console.error("Erreur lors de la récupération des interventions:", error);
        throw error;
      }

      console.log("Interventions récupérées:", data?.length || 0, "éléments pour l'année", selectedYear);
      return data || [];
    },
    enabled: !!propertyId,
  });

  const { data: rentData = [], isLoading: rentLoading, refetch: refetchRent } = useQuery({
    queryKey: ["tenant_payments", propertyId, selectedYear],
    queryFn: async () => {
      if (!propertyId) {
        return [];
      }

      console.log("Récupération des paiements pour propertyId:", propertyId, "année:", selectedYear);
      
      const { data, error } = await supabase
        .from("tenant_payments")
        .select(`
          *,
          tenants!inner (
            property_id
          )
        `)
        .eq("tenants.property_id", propertyId)
        .gte("payment_date", `${selectedYear}-01-01`)
        .lte("payment_date", `${selectedYear}-12-31`)
        .order("payment_date", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des paiements:", error);
        throw error;
      }

      console.log("Paiements récupérés:", data?.length || 0, "éléments pour l'année", selectedYear);
      return data || [];
    },
    enabled: !!propertyId,
  });

  const refetch = async () => {
    console.log("Rafraîchissement de toutes les données financières pour", propertyId, selectedYear);
    await Promise.all([
      refetchExpenses(),
      refetchMaintenance(),
      refetchRent()
    ]);
  };

  return {
    expenses,
    maintenance,
    rentData,
    isLoading: expensesLoading || maintenanceLoading || rentLoading,
    refetch
  };
};
