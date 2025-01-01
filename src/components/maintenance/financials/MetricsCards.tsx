import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, TrendingUp, Wrench } from "lucide-react";

interface MetricsCardsProps {
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
  calculateROI: () => string;
}

export const MetricsCards = ({ rentRoll, expenses, maintenance, calculateROI }: MetricsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rent Roll</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${rentRoll.reduce((acc, curr) => acc + curr.rent, 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Monthly total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Year to date</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance Costs</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${maintenance.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}
          </div>
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