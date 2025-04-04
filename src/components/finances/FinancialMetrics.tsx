
import React from "react";
import { DollarSign, TrendingDown, BarChart, Home, AlertCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { NoPropertySelected } from "./metrics/NoPropertySelected";
import { FinancialMetricCard } from "./metrics/FinancialMetricCard";
import { useFinancialMetricsData } from "./metrics/useFinancialMetricsData";

interface FinancialMetricsProps {
  propertyId: string | null;
}

export default function FinancialMetrics({ propertyId }: FinancialMetricsProps) {
  const { t } = useLocale();
  const { data: financialData, isLoading } = useFinancialMetricsData(propertyId);

  if (isLoading) {
    return <LoadingMetrics />;
  }

  if (!propertyId) {
    return <NoPropertySelected />;
  }

  // Récupérer les données des métriques
  const totalIncome = financialData?.totalIncome || 0;
  const totalExpenses = financialData?.totalExpenses || 0;
  const occupancyRate = financialData?.occupancyRate || 0;
  const unpaidRent = financialData?.unpaidRent || 0;
  
  // Récupérer les tendances
  const trends = financialData?.trends || {
    totalIncomeTrend: 0,
    totalExpensesTrend: 0,
    occupancyRateTrend: 0,
    unpaidRentTrend: 0
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <FinancialMetricCard
        title={t('totalIncome')}
        value={`$${totalIncome.toLocaleString()}`}
        icon={<DollarSign className="h-5 w-5" />}
        description={t('allTimeIncome')}
        chartColor="#22C55E"
        trend={trends.totalIncomeTrend}
      />
      
      <FinancialMetricCard
        title={t('totalExpenses')}
        value={`$${totalExpenses.toLocaleString()}`}
        icon={<TrendingDown className="h-5 w-5" />}
        description={t('allTimeExpenses')}
        chartColor="#F43F5E"
        trend={trends.totalExpensesTrend}
      />
      
      <FinancialMetricCard
        title={t('occupancyRate')}
        value={`${occupancyRate.toFixed(0)}%`}
        icon={<Home className="h-5 w-5" />}
        description={t('occupancyRateDescription')}
        chartColor="#3B82F6"
        trend={trends.occupancyRateTrend}
      />
      
      <FinancialMetricCard
        title={t('unpaidRent')}
        value={`$${unpaidRent.toLocaleString()}`}
        icon={<AlertCircle className="h-5 w-5" />}
        description={t('unpaidRentDescription')}
        chartColor="#F59E0B"
        trend={trends.unpaidRentTrend}
      />
    </div>
  );
}
