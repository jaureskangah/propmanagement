
import React from "react";
import { MetricsCards } from "./financials/MetricsCards";
import { DataTables } from "./financials/DataTables";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface PropertyFinancialsProps {
  propertyId: string;
}

export const PropertyFinancials = ({ propertyId }: PropertyFinancialsProps) => {
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

  // Fetch maintenance interventions data with property information
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
          ),
          properties (
            name
          )
        `)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching maintenance interventions:", error);
        throw error;
      }

      console.log("Fetched maintenance interventions:", data);
      return data;
    },
  });

  // Get the current year's start
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1).toISOString();

  // Fetch total rent paid for the current year (all payments)
  const { data: rentData = [] } = useQuery({
    queryKey: ["all_rent_payments", currentYear],
    queryFn: async () => {
      // Get all payments for the current year
      const { data: payments, error: paymentsError } = await supabase
        .from("tenant_payments")
        .select("*")
        .gte("payment_date", startOfYear);

      if (paymentsError) throw paymentsError;
      console.log("Fetched rent payments for ROI calculation:", payments);
      return payments || [];
    },
  });

  // Calculate ROI
  const calculateROI = () => {
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalMaintenance = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    const totalIncome = rentData.filter(payment => payment.status === "paid")
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    console.log("ROI calculation:", { totalExpenses, totalMaintenance, totalIncome });
    
    const propertyValue = 500000; // This would ideally come from the property data
    const netIncome = totalIncome - totalExpenses - totalMaintenance;
    
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
      <DataTables
        propertyId={propertyId}
        expenses={expenses}
        maintenance={maintenance}
      />
    </div>
  );
};
