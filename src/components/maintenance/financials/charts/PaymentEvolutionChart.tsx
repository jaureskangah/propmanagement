
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
import { usePaymentChartData } from "./hooks/usePaymentChartData";
import { PaymentChartTooltip } from "./tooltips/PaymentChartTooltip";

interface PaymentEvolutionChartProps {
  propertyId: string;
}

export const PaymentEvolutionChart = ({ propertyId }: PaymentEvolutionChartProps) => {
  const { data: paymentData = [] } = usePaymentChartData(propertyId);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Payment Evolution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={paymentData}
              margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
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
                fontSize={10}
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                padding={{ top: 10, bottom: 10 }}
              />
              <Tooltip content={<PaymentChartTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={24}
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ fontSize: '10px' }}
              />
              <Area
                type="monotone"
                dataKey="paid"
                stackId="1"
                stroke="#22C55E"
                strokeWidth={1.5}
                fill="url(#colorPaid)"
                name="Paid"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#EAB308"
                strokeWidth={1.5}
                fill="url(#colorPending)"
                name="Pending"
              />
              <Area
                type="monotone"
                dataKey="late"
                stackId="1"
                stroke="#EF4444"
                strokeWidth={1.5}
                fill="url(#colorLate)"
                name="Late"
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#3B82F6"
                strokeWidth={1.5}
                fill="none"
                name="Cumulative Total"
                dot={{ r: 2.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
