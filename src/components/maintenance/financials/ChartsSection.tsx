import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";

interface ChartsSectionProps {
  propertyId: string;
}

export const ChartsSection = ({ propertyId }: ChartsSectionProps) => {
  const { data: paymentData = [] } = useQuery({
    queryKey: ["property_payments", propertyId],
    queryFn: async () => {
      console.log("Fetching payment data for property:", propertyId);
      
      // First get all tenants for this property
      const { data: tenants, error: tenantsError } = await supabase
        .from("tenants")
        .select("id")
        .eq("property_id", propertyId);

      if (tenantsError) {
        console.error("Error fetching tenants:", tenantsError);
        throw tenantsError;
      }

      if (!tenants?.length) return [];

      const tenantIds = tenants.map(t => t.id);
      
      // Then get all payments for these tenants
      const { data: payments, error: paymentsError } = await supabase
        .from("tenant_payments")
        .select("amount, payment_date, status")
        .in("tenant_id", tenantIds)
        .order("payment_date", { ascending: true });

      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        throw paymentsError;
      }

      // Group payments by month and calculate total
      const monthlyPayments = payments?.reduce((acc: any, payment) => {
        const date = format(parseISO(payment.payment_date), 'MMM yyyy');
        if (!acc[date]) {
          acc[date] = { total: 0, paid: 0, pending: 0 };
        }
        acc[date].total += payment.amount;
        if (payment.status === 'paid') {
          acc[date].paid += payment.amount;
        } else if (payment.status === 'pending') {
          acc[date].pending += payment.amount;
        }
        return acc;
      }, {});

      // Convert to array format for Recharts
      return Object.entries(monthlyPayments || {}).map(([date, data]: [string, any]) => ({
        date,
        total: data.total,
        paid: data.paid,
        pending: data.pending
      }));
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Evolution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={paymentData}>
              <defs>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`]}
              />
              <Area
                type="monotone"
                dataKey="paid"
                stroke="#22C55E"
                fillOpacity={1}
                fill="url(#colorPaid)"
                name="Paid"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stroke="#EAB308"
                fillOpacity={1}
                fill="url(#colorPending)"
                name="Pending"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};