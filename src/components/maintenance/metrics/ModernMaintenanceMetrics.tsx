
import React from "react";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ModernMetricCard } from "../financials/components/ModernMetricCard";

interface ModernMaintenanceMetricsProps {
  total: number;
  pending: number;
  resolved: number;
  propertyId?: string;
  selectedYear?: number;
  isLoading?: boolean;
}

export const ModernMaintenanceMetrics = ({ 
  total, 
  pending, 
  resolved, 
  propertyId, 
  selectedYear,
  isLoading = false 
}: ModernMaintenanceMetricsProps) => {
  const { t } = useLocale();
  
  const metrics = [
    {
      title: t('totalRequests'),
      value: isLoading ? "..." : total.toString(),
      description: t('totalRequestsDescription'),
      icon: <ClipboardList className="h-5 w-5" />,
      chartColor: "#3B82F6", // Blue
    },
    {
      title: t('pendingRequests'),
      value: isLoading ? "..." : pending.toString(),
      description: t('pendingRequestsDescription'),
      icon: <Clock className="h-5 w-5" />,
      chartColor: "#F59E0B", // Amber
    },
    {
      title: t('resolvedRequests'),
      value: isLoading ? "..." : resolved.toString(),
      description: t('resolvedRequestsDescription'),
      icon: <CheckCircle className="h-5 w-5" />,
      chartColor: "#22C55E", // Green
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <ModernMetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
          chartColor={metric.chartColor}
          index={index}
        />
      ))}
    </div>
  );
};
