
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceChartsProps {
  propertyId: string;
}

// Données fictives pour les graphiques - dans une application réelle, ces données viendraient d'une API
const chartData = [
  { month: "Jan", requests: 4, completed: 3, urgent: 1, expenses: 400 },
  { month: "Feb", requests: 3, completed: 2, urgent: 0, expenses: 300 },
  { month: "Mar", requests: 5, completed: 4, urgent: 2, expenses: 550 },
  { month: "Apr", requests: 2, completed: 2, urgent: 0, expenses: 200 },
  { month: "May", requests: 7, completed: 5, urgent: 3, expenses: 650 },
  { month: "Jun", requests: 4, completed: 3, urgent: 1, expenses: 450 },
];

export const MaintenanceCharts = ({ propertyId }: MaintenanceChartsProps) => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>{t('maintenanceRequestsTrends')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#8884d8" name={t('totalRequests')} />
                <Line type="monotone" dataKey="completed" stroke="#4ade80" name={t('completedRequests')} />
                <Line type="monotone" dataKey="urgent" stroke="#ef4444" name={t('urgentRequests')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>{t('maintenanceExpensesTrends')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expenses" fill="#82ca9d" name={t('expenses')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
