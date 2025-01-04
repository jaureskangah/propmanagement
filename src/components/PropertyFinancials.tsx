import React from "react";
import { MetricsCards } from "./maintenance/financials/MetricsCards";
import { DataTables } from "./maintenance/financials/DataTables";
import { ChartsSection } from "./maintenance/financials/ChartsSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface PropertyFinancialsProps {
  propertyId: string;
}

const PropertyFinancials = ({ propertyId }: PropertyFinancialsProps) => {
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
        console.error("Error fetching expenses:", error);
        throw error;
      }

      console.log("Fetched expenses:", data);
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
        console.error("Error fetching maintenance interventions:", error);
        throw error;
      }

      console.log("Fetched maintenance interventions:", data);
      return data;
    },
  });

  // Calculate ROI based on real data
  const calculateROI = () => {
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalMaintenance = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    // Note: propertyValue should ideally come from the properties table
    const propertyValue = 500000; // This is still hardcoded as it's not in our database schema
    const netIncome = -totalExpenses - totalMaintenance;
    return ((netIncome / propertyValue) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <MetricsCards
        propertyId={propertyId}
        expenses={expenses}
        maintenance={maintenance}
        calculateROI={calculateROI}
      />
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