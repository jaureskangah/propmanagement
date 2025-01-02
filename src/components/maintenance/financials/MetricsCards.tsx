import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, TrendingUp, Wrench } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface MetricsCardsProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
  calculateROI: () => string;
}

export const MetricsCards = ({ propertyId, expenses, maintenance, calculateROI }: MetricsCardsProps) => {
  // Fetch total rent and payments data
  const { data: rentData } = useQuery({
    queryKey: ["property_rent_data", propertyId],
    queryFn: async () => {
      console.log("Fetching rent data for property:", propertyId);
      const { data: tenants, error } = await supabase
        .from("tenants")
        .select(`
          id,
          rent_amount,
          tenant_payments (
            amount,
            status,
            payment_date
          )
        `)
        .eq("property_id", propertyId);

      if (error) {
        console.error("Error fetching rent data:", error);
        throw error;
      }

      console.log("Rent data fetched:", tenants);
      return tenants;
    },
  });

  // Calculate metrics
  const totalRentRoll = rentData?.reduce((acc, tenant) => acc + (tenant.rent_amount || 0), 0) || 0;
  
  const totalCollected = rentData?.reduce((acc, tenant) => {
    const paidPayments = tenant.tenant_payments?.filter(p => p.status === 'paid') || [];
    return acc + paidPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  }, 0) || 0;

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMaintenance = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rent Roll</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRentRoll.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Monthly total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalCollected.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Year to date</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
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