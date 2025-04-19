
import React from 'react';
import { ClipboardList, Clock, CheckCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface MaintenanceMetricsProps {
  total: number;
  pending: number;
  resolved: number;
  propertyId?: string;
  selectedYear?: number;
  isLoading?: boolean;
}

export const MaintenanceMetrics = ({ 
  total, 
  pending, 
  resolved, 
  propertyId, 
  selectedYear,
  isLoading = false 
}: MaintenanceMetricsProps) => {
  const { t } = useLocale();
  
  const metrics = [
    {
      value: total,
      label: t('totalRequests'),
      icon: ClipboardList,
      bgColor: "bg-blue-50/80",
      iconColor: "text-blue-500",
      borderColor: "border-blue-100",
    },
    {
      value: pending,
      label: t('pendingRequests'),
      icon: Clock,
      bgColor: "bg-amber-50/80",
      iconColor: "text-amber-500",
      borderColor: "border-amber-100",
    },
    {
      value: resolved,
      label: t('resolvedRequests'),
      icon: CheckCircle,
      bgColor: "bg-green-50/80",
      iconColor: "text-green-500",
      borderColor: "border-green-100",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`relative overflow-hidden rounded-xl ${metric.bgColor} border ${metric.borderColor} p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between mb-4">
            <metric.icon className={`h-8 w-8 ${metric.iconColor}`} />
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                metric.value
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {metric.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
