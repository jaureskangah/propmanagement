
import { useFinancialMetricsData } from "./metrics/useFinancialMetricsData";
import { FinancialMetricCard } from "./metrics/FinancialMetricCard";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { NoPropertySelected } from "./metrics/NoPropertySelected";
import { ErrorState } from "./metrics/ErrorState";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DollarSign, Home, BanknoteIcon, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface FinancialMetricsProps {
  propertyId: string | null;
  selectedYear: number;
}

const FinancialMetrics = ({ propertyId, selectedYear }: FinancialMetricsProps) => {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useFinancialMetricsData(propertyId, selectedYear);

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingMetrics />;
  }

  if (error) {
    console.error("Error loading financial metrics:", error);
    return <ErrorState error={error as Error} onRetry={handleRetry} />;
  }

  if (!propertyId) {
    return <NoPropertySelected type="metrics" />;
  }

  if (!data) {
    return <NoPropertySelected type="metrics" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinancialMetricCard
        title={t('totalIncome')}
        value={formatCurrency(data.totalIncome)}
        trend={data.incomeTrend}
        icon={<DollarSign className="h-4 w-4" />}
        description={t('allTimeIncome')}
        format="currency"
      />
      <FinancialMetricCard
        title={t('totalExpenses')}
        value={formatCurrency(data.totalExpenses)}
        trend={data.expensesTrend}
        isNegativeBetter
        icon={<TrendingDown className="h-4 w-4" />}
        description={t('allTimeExpenses')}
        format="currency"
      />
      <FinancialMetricCard
        title={t('occupancyRate')}
        value={`${Math.floor(data.occupancyRate)}%`} // Utilisation de Math.floor pour enlever les décimales
        trend={data.occupancyRateTrend}
        format="percent"
        icon={<Home className="h-4 w-4" />}
        description={t('occupancyRateDescription')}
      />
      <FinancialMetricCard
        title={t('unpaidRent')}
        value={formatCurrency(data.unpaidRent)}
        trend={data.unpaidRentTrend}
        isNegativeBetter
        icon={<BanknoteIcon className="h-4 w-4" />}
        description={t('unpaidRentDescription')}
        format="currency"
      />
    </div>
  );
};

export default FinancialMetrics;
