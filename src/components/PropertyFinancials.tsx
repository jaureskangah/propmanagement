
import React, { useEffect } from "react";
import { MetricsCards } from "./maintenance/financials/MetricsCards";
import { DataTables } from "./maintenance/financials/DataTables";
import { ChartsSection } from "./maintenance/financials/ChartsSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyFinancialsProps {
  propertyId: string;
  selectedYear?: number;
}

const PropertyFinancials = ({ propertyId, selectedYear }: PropertyFinancialsProps) => {
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

  // Combine all expenses for allExpenses prop
  const allExpenses = [
    ...expenses.map(expense => ({
      amount: expense.amount || 0,
      date: expense.date,
      category: expense.category || 'Maintenance',
      type: 'expense' as const
    })),
    ...maintenance.map(intervention => ({
      amount: intervention.cost || 0,
      date: intervention.date,
      category: 'Intervention',
      type: 'intervention' as const
    }))
  ];

  return (
    <div className="space-y-6">
      <MetricsCards
        expenses={expenses}
        maintenance={maintenance}
        rentData={[]}
      />
      <ChartsSection propertyId={propertyId} />
      <DataTables
        propertyId={propertyId}
        expenses={expenses}
        allExpenses={allExpenses}
      />
    </div>
  );
};

export default PropertyFinancials;
