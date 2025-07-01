
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFinancialMetricsData } from "./metrics/useFinancialMetricsData";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { NoPropertySelected } from "./metrics/NoPropertySelected";
import { ErrorState } from "./metrics/ErrorState";
import { DollarSign, TrendingUp, TrendingDown, Home } from "lucide-react";
import { formatCurrencyFrench } from "@/lib/utils";
import { motion } from "framer-motion";

interface ModernFinancialMetricsProps {
  propertyId: string | null;
  selectedYear: number;
}

const ModernFinancialMetrics = ({ propertyId, selectedYear }: ModernFinancialMetricsProps) => {
  const { data, isLoading, error, refetch } = useFinancialMetricsData(propertyId, selectedYear);

  if (isLoading) return <LoadingMetrics />;
  if (error) return <ErrorState error={error as Error} onRetry={refetch} type="metrics" />;
  if (!propertyId) return <NoPropertySelected type="metrics" />;
  if (!data) return <NoPropertySelected type="metrics" />;

  const metrics = [
    {
      title: "Revenus totaux",
      value: formatCurrencyFrench(data.totalIncome),
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Dépenses totales", 
      value: formatCurrencyFrench(data.totalExpenses),
      icon: <TrendingDown className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Bénéfice net",
      value: formatCurrencyFrench(data.totalIncome - data.totalExpenses),
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
    },
    {
      title: "Taux d'occupation",
      value: `${Math.round(data.occupancyRate)}%`,
      icon: <Home className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <div className={metric.color}>{metric.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ModernFinancialMetrics;
