import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
          acc[date] = { total: 0, paid: 0, pending: 0, late: 0 };
        }
        acc[date].total += payment.amount;
        
        // Categorize payments
        if (payment.status === 'paid') {
          acc[date].paid += payment.amount;
        } else if (payment.status === 'pending') {
          acc[date].pending += payment.amount;
        } else if (payment.status === 'late') {
          acc[date].late += payment.amount;
        }
        return acc;
      }, {});

      // Convert to array format for Recharts and calculate cumulative totals
      let cumulativeTotal = 0;
      return Object.entries(monthlyPayments || {}).map(([date, data]: [string, any]) => {
        cumulativeTotal += data.paid;
        return {
          date,
          ...data,
          cumulative: cumulativeTotal
        };
      });
    },
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Evolution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={paymentData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted/50" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                padding={{ top: 20, bottom: 20 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="paid"
                stackId="1"
                stroke="#22C55E"
                fill="url(#colorPaid)"
                name="Paid"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#EAB308"
                fill="url(#colorPending)"
                name="Pending"
              />
              <Area
                type="monotone"
                dataKey="late"
                stackId="1"
                stroke="#EF4444"
                fill="url(#colorLate)"
                name="Late"
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="none"
                name="Cumulative Total"
                dot={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};