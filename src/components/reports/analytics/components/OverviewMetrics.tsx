import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import { useReportsTranslations } from "@/hooks/useReportsTranslations";

interface OverviewMetricsProps {
  properties: any[];
  tenants: any[];
  payments: any[];
  maintenance: any[];
}

export const OverviewMetrics = ({ properties, tenants, payments, maintenance }: OverviewMetricsProps) => {
  const { t, totalProperties, totalTenants, occupancyRate, totalRevenue, pendingMaintenance } = useReportsTranslations();

  // Calculate metrics
  const totalPropertiesValue = properties.length;
  const totalTenantsValue = tenants.length;
  const totalRevenueValue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const pendingMaintenanceValue = maintenance.filter(item => 
    item.status === 'pending' || item.status === 'Pending'
  ).length;
  
  // Calculate total units across all properties
  const totalUnits = properties.reduce((sum, property) => sum + (property.units || 1), 0);
  const occupancyRateValue = totalUnits > 0 ? Math.round((totalTenantsValue / totalUnits) * 100) : 0;

  const metrics = [
    {
      title: totalProperties,
      value: totalPropertiesValue.toString(),
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: totalTenants,
      value: totalTenantsValue.toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: occupancyRate,
      value: `${occupancyRateValue}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: totalRevenue,
      value: `$${totalRevenueValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      title: pendingMaintenance,
      value: pendingMaintenanceValue.toString(),
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={index} 
            className="group hover-lift glass-card cursor-pointer transition-all duration-300 border-border/50 hover:border-primary/20"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className={`p-2 sm:p-3 rounded-full ${metric.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.color} transition-colors duration-300`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    {metric.title}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold transition-colors duration-300 group-hover:text-primary">
                    {metric.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
