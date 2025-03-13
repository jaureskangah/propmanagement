
import React from "react";
import { DollarSign, TrendingDown, BarChart } from "lucide-react";
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

  // Calculate ROI
  const totalIncome = financialData?.totalIncome || 0;
  const totalExpenses = financialData?.totalExpenses || 0;
  const propertyValue = 500000; // This is a default value as we don't have the actual property value
  const netIncome = totalIncome - totalExpenses;
  const roi = propertyValue > 0 ? (netIncome / propertyValue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <FinancialMetricCard
        title={t('totalIncome')}
        value={`$${(totalIncome).toLocaleString()}`}
        icon={<DollarSign className="h-5 w-5" />}
        description={t('allTimeIncome')}
        chartColor="#22C55E"
        trend={15}
      />
      
      <FinancialMetricCard
        title={t('totalExpenses')}
        value={`$${(totalExpenses).toLocaleString()}`}
        icon={<TrendingDown className="h-5 w-5" />}
        description={t('allTimeExpenses')}
        chartColor="#F43F5E"
        trend={-8}
      />
      
      <FinancialMetricCard
        title="ROI"
        value={`${roi.toFixed(2)}%`}
        icon={<BarChart className="h-5 w-5" />}
        description={t('returnOnInvestment')}
        chartColor="#3B82F6"
        trend={5}
      />
    </div>
  );
}
