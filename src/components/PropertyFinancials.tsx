import React from "react";
import { MetricsCards } from "./maintenance/financials/MetricsCards";
import { DataTables } from "./maintenance/financials/DataTables";
import { MonthlyExpensesChart } from "./maintenance/financials/charts/MonthlyExpensesChart";
import { ExpensesByCategoryChart } from "./maintenance/financials/charts/ExpensesByCategoryChart";
import { ExpensesTrendChart } from "./maintenance/financials/charts/ExpensesTrendChart";

interface PropertyFinancialsProps {
  propertyId: string;
  rentRoll: {
    unit: string;
    tenant: string;
    rent: number;
    status: string;
  }[];
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

const PropertyFinancials = ({ propertyId, rentRoll, expenses, maintenance }: PropertyFinancialsProps) => {
  console.log("Rendering PropertyFinancials for property:", propertyId);

  const calculateROI = () => {
    const totalRent = rentRoll.reduce((acc, curr) => acc + curr.rent, 0) * 12;
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalMaintenance = maintenance.reduce((acc, curr) => acc + curr.cost, 0);
    const netIncome = totalRent - totalExpenses - totalMaintenance;
    // Assuming a property value for demonstration
    const propertyValue = 500000;
    return ((netIncome / propertyValue) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <MetricsCards
        rentRoll={rentRoll}
        expenses={expenses}
        maintenance={maintenance}
        calculateROI={calculateROI}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MonthlyExpensesChart expenses={expenses} />
        <ExpensesByCategoryChart expenses={expenses} />
        <ExpensesTrendChart expenses={expenses} />
      </div>

      <DataTables
        rentRoll={rentRoll}
        expenses={expenses}
        maintenance={maintenance}
      />
    </div>
  );
};

export default PropertyFinancials;