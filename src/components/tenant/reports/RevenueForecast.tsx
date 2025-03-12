
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { addMonths, format, differenceInMonths } from "date-fns";
import { enUS } from "date-fns/locale";

interface RevenueForecastProps {
  rentAmount: number;
  leaseStart: string;
  leaseEnd: string;
}

export const RevenueForecast = ({ rentAmount, leaseStart, leaseEnd }: RevenueForecastProps) => {
  // Calculate forecast data
  const generateForecastData = () => {
    const months = differenceInMonths(new Date(leaseEnd), new Date(leaseStart));
    const data = [];

    for (let i = 0; i <= months; i++) {
      const date = addMonths(new Date(leaseStart), i);
      data.push({
        month: format(date, 'MMM yyyy', { locale: enUS }),
        expected: rentAmount,
      });
    }

    return data;
  };

  const forecastData = generateForecastData();
  const totalRevenue = rentAmount * forecastData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Revenue Forecast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 px-3 pb-3">
              <div className="text-lg font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total Expected Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 px-3 pb-3">
              <div className="text-lg font-bold">${rentAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Monthly Rent</p>
            </CardContent>
          </Card>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgb(0 0 0 / 0.05)',
                  fontSize: '11px',
                  padding: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`]}
              />
              <Bar
                dataKey="expected"
                fill="#22c55e"
                radius={[3, 3, 0, 0]}
                barSize={16}
                className="fill-green-500 hover:fill-green-600 transition-colors"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
