import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentHistory } from "./PaymentHistory";
import { ExportOptions } from "./ExportOptions";
import { PerformanceCharts } from "./PerformanceCharts";
import { RevenueForecast } from "./RevenueForecast";

interface TenantFinancialReportProps {
  tenantId: string;
}

export const TenantFinancialReport = ({ tenantId }: TenantFinancialReportProps) => {
  const { data: tenant, isLoading: isLoadingTenant } = useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: async () => {
      // Production-ready: removed console.log
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", tenantId)
        .single();

      if (error) {
        console.error("Error fetching tenant data:", error);
        throw error;
      }

      console.log("Tenant data fetched:", data);
      return data;
    },
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["tenant_payments", tenantId],
    queryFn: async () => {
      console.log("Fetching tenant payments for tenant:", tenantId);
      const { data, error } = await supabase
        .from("tenant_payments")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("payment_date", { ascending: false });

      if (error) {
        console.error("Error fetching tenant payments:", error);
        throw error;
      }

      console.log("Tenant payments fetched:", data);
      return data;
    },
  });

  if (isLoadingTenant || isLoadingPayments) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Financial Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PaymentSummary payments={payments || []} />
          {tenant && (
            <RevenueForecast
              rentAmount={tenant.rent_amount}
              leaseStart={tenant.lease_start}
              leaseEnd={tenant.lease_end}
            />
          )}
          <PerformanceCharts tenantId={tenantId} />
          <PaymentHistory payments={payments || []} />
          <ExportOptions payments={payments || []} />
        </CardContent>
      </Card>
    </div>
  );
};