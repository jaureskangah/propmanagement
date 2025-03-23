
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { format, parseISO, subMonths } from "date-fns";
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
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import { Loader2 } from "lucide-react";

interface MaintenanceChartsProps {
  propertyId: string;
}

export const MaintenanceCharts = ({ propertyId }: MaintenanceChartsProps) => {
  const { t } = useLocale();
  
  // Récupération des données de maintenance
  const { data: maintenanceData, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["maintenance_data", propertyId],
    queryFn: async () => {
      console.log("Fetching maintenance data for property:", propertyId);
      
      const { data: maintenanceRequests, error: maintenanceError } = await supabase
        .from("maintenance_requests")
        .select("created_at, status, priority, estimated_cost")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: true });

      if (maintenanceError) {
        console.error("Error fetching maintenance requests:", maintenanceError);
        throw maintenanceError;
      }
      
      // Si pas de données réelles, utilisez des données fictives
      if (!maintenanceRequests?.length) {
        // Générer 6 mois de données fictives
        const today = new Date();
        const mockData = [];
        for (let i = 5; i >= 0; i--) {
          const date = subMonths(today, i);
          mockData.push({
            month: format(date, 'MMM yyyy'),
            requests: Math.floor(Math.random() * 7) + 1,
            completed: Math.floor(Math.random() * 5) + 1,
            urgent: Math.floor(Math.random() * 3),
            expenses: (Math.floor(Math.random() * 5) + 1) * 100
          });
        }
        console.log("Using mock maintenance data:", mockData);
        return mockData;
      }
      
      // Traiter les données réelles par mois
      const monthlyData = maintenanceRequests.reduce((acc: any, request) => {
        const month = format(parseISO(request.created_at), 'MMM yyyy');
        
        if (!acc[month]) {
          acc[month] = { 
            month, 
            requests: 0, 
            completed: 0, 
            urgent: 0,
            expenses: 0
          };
        }
        
        acc[month].requests += 1;
        
        if (request.status === 'completed' || request.status === 'resolved') {
          acc[month].completed += 1;
        }
        
        if (request.priority === 'urgent' || request.priority === 'high') {
          acc[month].urgent += 1;
        }
        
        if (request.estimated_cost) {
          acc[month].expenses += request.estimated_cost;
        }
        
        return acc;
      }, {});
      
      const result = Object.values(monthlyData);
      console.log("Processed maintenance data:", result);
      return result;
    },
  });
  
  // Afficher le chargement
  if (isLoadingMaintenance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('maintenanceMetrics')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // Si pas de données
  if (!maintenanceData || maintenanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('maintenanceMetrics')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64 text-muted-foreground">
          {t('noDataAvailable')}
        </CardContent>
      </Card>
    );
  }
  
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
                data={maintenanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    fontSize: '11px',
                    padding: '8px',
                  }}
                />
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
                data={maintenanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    fontSize: '11px',
                    padding: '8px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`]}
                />
                <Bar dataKey="expenses" fill="#82ca9d" name={t('expenses')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
