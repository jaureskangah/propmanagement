import React from "react";
import { MonthlyExpensesChart } from "./charts/MonthlyExpensesChart";
import { ExpensesByCategoryChart } from "./charts/ExpensesByCategoryChart";
import { ExpensesTrendChart } from "./charts/ExpensesTrendChart";

interface ChartsSectionProps {
  expenses: {
    category: string;
    amount: number;
    date: string;
  }[];
}

export const ChartsSection = ({ expenses }: ChartsSectionProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MonthlyExpensesChart expenses={expenses} />
      <ExpensesByCategoryChart expenses={expenses} />
      <ExpensesTrendChart expenses={expenses} />
    </div>
  );
};