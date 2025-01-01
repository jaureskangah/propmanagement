import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpensesTrendChartProps {
  expenses: {
    category: string;
    amount: number;
    date: string;
  }[];
}

export const ExpensesTrendChart = ({ expenses }: ExpensesTrendChartProps) => {
  const trendData = useMemo(() => {
    const sortedExpenses = [...expenses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulative = 0;
    return sortedExpenses.map(expense => {
      cumulative += expense.amount;
      return {
        date: new Date(expense.date).toLocaleDateString('en-US'),
        total: cumulative,
      };
    });
  }, [expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Total"]}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#ea384c" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};