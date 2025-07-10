import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceAnalyticsProps {
  maintenance: any[];
}

export const MaintenanceAnalytics = ({ maintenance }: MaintenanceAnalyticsProps) => {
  const { t } = useLocale();

  // Analyze maintenance by priority
  const maintenanceByPriority = maintenance.reduce((acc, item) => {
    const priority = item.priority || 'Medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyze maintenance by status
  const maintenanceByStatus = maintenance.reduce((acc, item) => {
    const status = item.status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityData = Object.entries(maintenanceByPriority).map(([priority, count]) => ({
    priority: t(priority.toLowerCase(), { fallback: priority }),
    count,
    color: priority === 'Urgent' || priority === 'urgent' ? '#ef4444' : 
           priority === 'High' || priority === 'high' ? '#f97316' :
           priority === 'Medium' || priority === 'medium' ? '#eab308' : '#22c55e'
  }));

  const statusData = Object.entries(maintenanceByStatus).map(([status, count]) => ({
    status: t(status.toLowerCase(), { fallback: status }),
    count,
    color: status === 'Pending' || status === 'pending' ? '#f59e0b' : 
           status === 'In Progress' || status === 'in_progress' ? '#3b82f6' : '#10b981'
  }));

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {t('maintenanceByPriority', { fallback: 'Maintenance par Priorité' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis 
                  dataKey="priority" 
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  formatter={(value: number) => [value, t('requests', { fallback: 'Demandes' })]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {t('maintenanceByStatus', { fallback: 'Maintenance par Statut' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis 
                  dataKey="status" 
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  formatter={(value: number) => [value, t('requests', { fallback: 'Demandes' })]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                 <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};