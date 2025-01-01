import React from "react";
import { MetricsCards } from "./financials/MetricsCards";
import { ChartsSection } from "./financials/ChartsSection";
import { DataTables } from "./financials/DataTables";

interface PropertyFinancialsProps {
  propertyId: string;
  expenses: {
    category: string;
    amount: number;
    date: string;
  }[];
  maintenance: {
    description: string;
    cost: number;
    date: string;
  }[];
}

export const PropertyFinancials = ({ propertyId, expenses, maintenance }: PropertyFinancialsProps) => {
  console.log("Rendering PropertyFinancials for property:", propertyId);

  // Calculate ROI
  const calculateROI = () => {
    // We'll calculate the total rent from the actual tenant data in MetricsCards
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalMaintenance = maintenance.reduce((acc, curr) => acc + curr.cost, 0);
    const propertyValue = 500000; // Assuming a property value for demonstration
    const netIncome = -totalExpenses - totalMaintenance; // The rent will be added in MetricsCards
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
      <ChartsSection expenses={expenses} />
      <DataTables 
        propertyId={propertyId}
        expenses={expenses}
        maintenance={maintenance}
      />
    </div>
  );
};