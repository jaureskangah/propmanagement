
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

  // Get the current year's start
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1).toISOString();

  // Fetch total rent paid for this property in the current year
  const { data: rentData = [] } = useQuery({
    queryKey: ["property_rent_payments", propertyId, currentYear],
    queryFn: async () => {
      // First get tenants for this property
      const { data: tenants, error: tenantsError } = await supabase
        .from("tenants")
        .select("id")
        .eq("property_id", propertyId);
        
      if (tenantsError) throw tenantsError;
      
      if (!tenants?.length) return [];
      
      const tenantIds = tenants.map(t => t.id);
      
      // Then get payments for these tenants
      const { data: payments, error: paymentsError } = await supabase
        .from("tenant_payments")
        .select("*")
        .in("tenant_id", tenantIds)
        .gte("payment_date", startOfYear);

      if (paymentsError) throw paymentsError;
      console.log(`Fetched ${payments?.length || 0} rent payments for ROI calculation for property ${propertyId}`);
      return payments || [];
    },
  });

  // Calculate ROI
  const calculateROI = () => {
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalMaintenance = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    const totalIncome = rentData.filter(payment => payment.status === "paid")
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    console.log("ROI calculation for property:", propertyId, {
      totalExpenses,
      totalMaintenance,
      totalIncome,
      rentPaymentsCount: rentData.length
    });
    
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
