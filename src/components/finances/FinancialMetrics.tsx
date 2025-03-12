
import React from "react";
import { DollarSign, Wallet, Users, AlertCircle } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <FinancialMetricCard
        title={t('totalIncome')}
        value={`$${(financialData?.totalIncome || 0).toLocaleString()}`}
        icon={<DollarSign className="h-5 w-5" />}
        description={t('allTimeIncome')}
        chartColor="#22C55E"
        trend={15}
      />
      
      <FinancialMetricCard
        title={t('totalExpenses')}
        value={`$${(financialData?.totalExpenses || 0).toLocaleString()}`}
        icon={<Wallet className="h-5 w-5" />}
        description={t('allTimeExpenses')}
        chartColor="#F43F5E"
        trend={8}
      />
      
      <FinancialMetricCard
        title={t('occupancyRate')}
        value={`${Math.round(financialData?.occupancyRate || 0)}%`}
        icon={<Users className="h-5 w-5" />}
        description={t('occupancyRateDescription')}
        chartColor="#3B82F6"
        trend={-2}
      />
      
      <FinancialMetricCard
        title={t('unpaidRent')}
        value={`$${(financialData?.unpaidRent || 0).toLocaleString()}`}
        icon={<AlertCircle className="h-5 w-5" />}
        description={t('unpaidRentDescription')}
        chartColor="#8B5CF6"
        trend={5}
      />
    </div>
  );
}
