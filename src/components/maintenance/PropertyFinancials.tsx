
import React, { useEffect } from "react";
import { MetricsCards } from "./financials/MetricsCards";
import { DataTables } from "./financials/DataTables";
import { useFinancialData } from "./financials/hooks/useFinancialData";

interface PropertyFinancialsProps {
  propertyId: string;
  selectedYear?: number;
}

export const PropertyFinancials = ({ 
  propertyId,
  selectedYear = new Date().getFullYear()
}: PropertyFinancialsProps) => {
  console.log("Rendering PropertyFinancials for property:", propertyId, "and year:", selectedYear);

  useEffect(() => {
    console.log("PropertyFinancials monté/mis à jour avec propertyId:", propertyId);
    
    if (!propertyId) {
      console.error("PropertyFinancials - ATTENTION: propertyId est manquant!");
    }
  }, [propertyId]);

  const { expenses, maintenance, rentData } = useFinancialData(propertyId, selectedYear);

  return (
    <div className="space-y-6">
      <MetricsCards
        expenses={expenses}
        maintenance={maintenance}
        rentData={rentData}
      />
      <div className="space-y-6">
        <DataTables 
          propertyId={propertyId} 
          expenses={expenses} 
          maintenance={maintenance} 
        />
      </div>
    </div>
  );
};
