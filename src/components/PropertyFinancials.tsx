
import React from "react";
import FinancialMetrics from "./finances/FinancialMetrics";
import { DataTables } from "./maintenance/financials/DataTables";
import { ChartsSection } from "./maintenance/financials/ChartsSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyFinancialsProps {
  propertyId: string;
}

const PropertyFinancials = ({ propertyId }: PropertyFinancialsProps) => {
  const { t } = useLocale();
  console.log("Rendering PropertyFinancials for property:", propertyId);

  // Fetch expenses data
  const { data: expenses = [] } = useQuery({
    queryKey: ["maintenance_expenses", propertyId],
    queryFn: async () => {
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
  const { data: maintenance = [] } = useQuery({
    queryKey: ["vendor_interventions", propertyId],
    queryFn: async () => {
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

  return (
    <div className="space-y-6">
      <FinancialMetrics propertyId={propertyId} />
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
