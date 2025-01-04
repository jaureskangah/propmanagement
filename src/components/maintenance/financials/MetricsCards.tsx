import React from "react";
import { DashboardMetric } from "@/components/DashboardMetric";
import { FileText, TrendingUp, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface MetricsCardsProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
  calculateROI: () => string;
}

export const MetricsCards = ({ propertyId, expenses, maintenance, calculateROI }: MetricsCardsProps) => {
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMaintenance = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  // Fetch total rent payments for the property
  const { data: totalRentPaid = 0 } = useQuery({
    queryKey: ["total_rent_paid", propertyId],
    queryFn: async () => {
      console.log("Fetching total rent paid for property:", propertyId);
      
      const { data: tenants, error: tenantsError } = await supabase
        .from("tenants")
        .select("id")
        .eq("property_id", propertyId);

      if (tenantsError) {
        console.error("Error fetching tenants:", tenantsError);
        throw tenantsError;
      }

      if (!tenants?.length) return 0;

      const tenantIds = tenants.map(t => t.id);
      
      const { data: payments, error: paymentsError } = await supabase
        .from("tenant_payments")
        .select("amount")
        .in("tenant_id", tenantIds)
        .eq("status", "paid");

      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        throw paymentsError;
      }

      const total = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      console.log("Total rent paid:", total);
      return total;
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DashboardMetric
        title="Total Expenses"
        value={`$${(totalExpenses + totalMaintenance).toLocaleString()}`}
        icon={<FileText className="h-4 w-4" />}
        description="Year to date"
      />

      <DashboardMetric
        title="ROI"
        value={`${calculateROI()}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        description="Annual return"
      />

      <DashboardMetric
        title="Total Rent Paid"
        value={`$${totalRentPaid.toLocaleString()}`}
        icon={<Wallet className="h-4 w-4" />}
        description="All time"
        chartColor="#22C55E"
      />
    </div>
  );
};