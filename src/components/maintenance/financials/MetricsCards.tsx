import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp } from "lucide-react";

interface MetricsCardsProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
  calculateROI: () => string;
}

export const MetricsCards = ({ propertyId, expenses, maintenance, calculateROI }: MetricsCardsProps) => {
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMaintenance = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(totalExpenses + totalMaintenance).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Year to date</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ROI</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculateROI()}%</div>
          <p className="text-xs text-muted-foreground">Annual return</p>
        </CardContent>
      </Card>
    </div>
  );
};