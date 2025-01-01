import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, TrendingUp, Wrench } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface MetricsCardsProps {
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
  calculateROI: () => string;
}

export const MetricsCards = ({ propertyId, expenses, maintenance, calculateROI }: MetricsCardsProps) => {
  const { data: totalRent = 0 } = useQuery({
    queryKey: ["totalRent", propertyId],
    queryFn: async () => {
      console.log("Fetching total rent for property:", propertyId);
      const { data, error } = await supabase
        .from("tenants")
        .select("rent_amount")
        .eq("property_id", propertyId);

      if (error) {
        console.error("Error fetching total rent:", error);
        throw error;
      }

      const total = data.reduce((acc, tenant) => acc + tenant.rent_amount, 0);
      console.log("Total rent calculated:", total);
      return total;
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rent Roll</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalRent.toLocaleString()}
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