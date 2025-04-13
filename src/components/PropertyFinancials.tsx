
import React, { useEffect } from "react";
import FinancialMetrics from "./finances/FinancialMetrics";
import { DataTables } from "./maintenance/financials/DataTables";
import { ChartsSection } from "./maintenance/financials/ChartsSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyFinancialsProps {
  propertyId: string;
  selectedYear?: number;
}

const PropertyFinancials = ({ propertyId, selectedYear = new Date().getFullYear() }: PropertyFinancialsProps) => {
  const { t } = useLocale();
  console.log("Rendering PropertyFinancials for property:", propertyId);

  useEffect(() => {
    console.log("PropertyFinancials mounted/updated for property:", propertyId);
  }, [propertyId]);

  // Fetch expenses data
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError } = useQuery({
    queryKey: ["maintenance_expenses", propertyId],
    queryFn: async () => {
      console.log("Fetching expenses for property:", propertyId);
      const { data, error } = await supabase
        .from("maintenance_expenses")
        .select("*")
        .eq("property_id", propertyId)
        .order("date", { ascending: false });

      if (error) {
        console.error(t('error') + ":", error);
        throw error;
      }

      console.log(t('loadingData') + ":", data);
      return data;
    },
  });

  // Fetch maintenance interventions data
  const { data: maintenance = [], isLoading: maintenanceLoading, error: maintenanceError } = useQuery({
    queryKey: ["vendor_interventions", propertyId],
    queryFn: async () => {
      console.log("Fetching interventions for property:", propertyId);
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
        .order("date", { ascending: false });

      if (error) {
        console.error(t('error') + ":", error);
        throw error;
      }

      console.log(t('loadingInterventions') + ":", data);
      return data;
    },
  });

  if (expensesLoading || maintenanceLoading) {
    return <div className="py-4">Chargement des données financières...</div>;
  }

  if (expensesError || maintenanceError) {
    return <div className="py-4 text-red-500">Erreur lors du chargement des données</div>;
  }

  return (
    <div className="space-y-6">
      <FinancialMetrics propertyId={propertyId} selectedYear={selectedYear} />
      <ChartsSection propertyId={propertyId} />
      <DataTables
        propertyId={propertyId}
        expenses={expenses}
        maintenance={maintenance}
      />
    </div>
  );
};

export default PropertyFinancials;
