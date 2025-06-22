
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
        rentData={rentData}
      />
      <div className="space-y-6">
        <DataTables 
          propertyId={propertyId} 
          expenses={expenses} 
          allExpenses={allExpenses}
        />
      </div>
    </div>
  );
};
