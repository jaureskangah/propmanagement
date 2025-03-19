
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceChartsProps {
  propertyId: string;
}

const chartData = [
  { month: "Jan", requests: 4, expenses: 400 },
  { month: "Feb", requests: 3, expenses: 300 },
  { month: "Mar", requests: 5, expenses: 550 },
  { month: "Apr", requests: 2, expenses: 200 },
  { month: "May", requests: 7, expenses: 650 },
  { month: "Jun", requests: 4, expenses: 450 },
];

export const MaintenanceCharts = ({ propertyId }: MaintenanceChartsProps) => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('maintenanceRequestsByMonth')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('maintenanceExpensesByMonth')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expenses" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
