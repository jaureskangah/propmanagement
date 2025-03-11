
import React from "react";
import { DollarSign, Wallet, TrendingUp, Landmark } from "lucide-react";
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinancialMetricCard
        title={t('totalIncome')}
        value={`$${(financialData?.totalIncome || 0).toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4" />}
        description={t('allTimeIncome')}
        chartColor="#22C55E"
      />
      
      <FinancialMetricCard
        title={t('totalExpenses')}
        value={`$${(financialData?.totalExpenses || 0).toLocaleString()}`}
        icon={<Wallet className="h-4 w-4" />}
        description={t('allTimeExpenses')}
        chartColor="#F43F5E"
      />
      
      <FinancialMetricCard
        title={t('netIncome')}
        value={`$${(financialData?.netIncome || 0).toLocaleString()}`}
        icon={<Landmark className="h-4 w-4" />}
        description={t('totalProfit')}
        chartColor="#3B82F6"
      />
      
      <FinancialMetricCard
        title="ROI"
        value={`${(financialData?.roi || 0).toFixed(2)}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        description={t('returnOnInvestment')}
        chartColor="#8B5CF6"
      />
    </div>
  );
}
