import React from "react";
import { RentRollTable } from "./tables/RentRollTable";
import { ExpensesTable } from "./tables/ExpensesTable";
import { MaintenanceTable } from "./tables/MaintenanceTable";

interface DataTablesProps {
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

export const DataTables = ({ rentRoll, expenses, maintenance }: DataTablesProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RentRollTable rentRoll={rentRoll} />
      <ExpensesTable expenses={expenses} />
      <MaintenanceTable maintenance={maintenance} />
    </div>
  );
};