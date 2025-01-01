import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyExpensesChartProps {
  expenses: {
    category: string;
    amount: number;
    date: string;
  }[];
}

export const MonthlyExpensesChart = ({ expenses }: MonthlyExpensesChartProps) => {
  const monthlyData = useMemo(() => {
    const data = new Array(12).fill(0).map((_, index) => ({
      month: new Date(2024, index).toLocaleString('en-US', { month: 'short' }),
      total: 0,
    }));

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthIndex = date.getMonth();
      data[monthIndex].total += expense.amount;
    });

    return data;
  }, [expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Total"]}
              />
              <Bar dataKey="total" fill="#ea384c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};