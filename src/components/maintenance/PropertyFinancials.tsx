
import React, { useEffect } from "react";
import { MetricsCards } from "./financials/MetricsCards";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MaintenanceTable } from "./financials/tables/MaintenanceTable";
import { DataTables } from "./financials/DataTables";

interface PropertyFinancialsProps {
  propertyId: string;
  selectedYear?: number;
}

export const PropertyFinancials = ({ 
  propertyId,
  selectedYear = new Date().getFullYear()
}: PropertyFinancialsProps) => {
  console.log("Rendering PropertyFinancials for property:", propertyId, "and year:", selectedYear);

  // Ajout d'un useEffect pour vérifier quand le composant est monté ou mis à jour
  useEffect(() => {
    console.log("PropertyFinancials monté/mis à jour avec propertyId:", propertyId);
    
    if (!propertyId) {
      console.error("PropertyFinancials - ATTENTION: propertyId est manquant!");
    }
  }, [propertyId]);

  // Fetch expenses data
  const { data: expenses = [] } = useQuery({
    queryKey: ["maintenance_expenses", propertyId, selectedYear],
    queryFn: async () => {
      const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
      const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
      
      console.log("Fetching expenses for property:", propertyId, "in date range:", startOfYear, "to", endOfYear);
      
      const { data, error } = await supabase
        .from("maintenance_expenses")
        .select("*")
        .eq("property_id", propertyId)
        .gte("date", startOfYear)
        .lte("date", endOfYear)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
        throw error;
      }

      console.log("Fetched expenses:", data);
      return data;
    },
    enabled: !!propertyId
  });

  // Fetch maintenance interventions data with property information
  const { data: maintenance = [] } = useQuery({
    queryKey: ["vendor_interventions", propertyId, selectedYear],
    queryFn: async () => {
      const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
      const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
      
      console.log("Fetching maintenance for property:", propertyId, "in date range:", startOfYear, "to", endOfYear);
      
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
        console.error("Error fetching maintenance interventions:", error);
        throw error;
      }

      console.log("Fetched maintenance interventions:", data);
      return data;
    },
    enabled: !!propertyId
  });

  // Fetch total rent paid for this property in the selected year
  const { data: rentData = [] } = useQuery({
    queryKey: ["property_rent_payments", propertyId, selectedYear],
    queryFn: async () => {
      try {
        // First get tenants for this property
        const { data: tenants, error: tenantsError } = await supabase
          .from("tenants")
          .select("id")
          .eq("property_id", propertyId);
          
        if (tenantsError) throw tenantsError;
        
        if (!tenants?.length) return [];
        
        const tenantIds = tenants.map(t => t.id);
        
        // Format dates correctly for filtering
        const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
        const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
        
        console.log("Found tenants for property:", tenantIds);
        console.log("Date range for payments:", startOfYear, "to", endOfYear);
        
        // Then get payments for these tenants within the selected year
        const { data: payments, error: paymentsError } = await supabase
          .from("tenant_payments")
          .select("*")
          .in("tenant_id", tenantIds)
          .gte("payment_date", startOfYear)
          .lte("payment_date", endOfYear);

        if (paymentsError) throw paymentsError;
        
        console.log(`Fetched ${payments?.length || 0} rent payments for property ${propertyId} in year ${selectedYear}`);
        console.log("Fetched payments for property", propertyId, "in year", selectedYear, ":", payments);
        return payments || [];
      } catch (error) {
        console.error("Error fetching rent payments:", error);
        return [];
      }
    },
    enabled: !!propertyId
  });

  // Calculate ROI
  const calculateROI = () => {
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalMaintenance = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    
    // Filter only paid payments
    const totalIncome = rentData
      .filter(payment => payment.status === "paid")
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    console.log("ROI calculation for property:", propertyId, {
      totalExpenses,
      totalMaintenance,
      totalIncome,
      rentPaymentsCount: rentData.length,
      year: selectedYear
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
        selectedYear={selectedYear}
        rentData={rentData}
      />
      <div className="space-y-6">
        {/* Remplacez MaintenanceTable par DataTables pour inclure toutes les tables */}
        <DataTables 
          propertyId={propertyId} 
          expenses={expenses} 
          maintenance={maintenance} 
        />
      </div>
    </div>
  );
};
