import React from "react";
import { RentRollTable } from "./tables/RentRollTable";
import { ExpensesTable } from "./tables/ExpensesTable";
import { MaintenanceTable } from "./tables/MaintenanceTable";
import { ExportButtons } from "./ExportButtons";

interface DataTablesProps {
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

export const DataTables = ({ propertyId, expenses, maintenance }: DataTablesProps) => {
  return (
    <div className="space-y-6">
      <ExportButtons expenses={expenses} maintenance={maintenance} />
      <RentRollTable propertyId={propertyId} />
      <div className="grid gap-4 md:grid-cols-2">
        <ExpensesTable expenses={expenses} />
        <MaintenanceTable maintenance={maintenance} />
      </div>
    </div>
  );
};