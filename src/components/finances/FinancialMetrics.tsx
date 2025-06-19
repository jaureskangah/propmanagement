
import { useFinancialMetricsData } from "./metrics/useFinancialMetricsData";
import { FinancialMetricCard } from "./metrics/FinancialMetricCard";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { NoPropertySelected } from "./metrics/NoPropertySelected";
import { ErrorState } from "./metrics/ErrorState";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DollarSign, Home, BanknoteIcon, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface FinancialMetricsProps {
  propertyId: string | null;
  selectedYear: number;
}

const FinancialMetrics = ({ propertyId, selectedYear }: FinancialMetricsProps) => {
  const { t } = useLocale();
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

  const metrics = [
    {
      title: t('totalIncome'),
      value: formatCurrency(data.totalIncome),
      trend: data.incomeTrend,
      icon: <DollarSign className="h-5 w-5" />,
      chartColor: '#22C55E',
      description: t('allTimeIncome'),
      format: "currency" as const
    },
    {
      title: t('totalExpenses'),
      value: formatCurrency(data.totalExpenses),
      trend: data.expensesTrend,
      isNegativeBetter: true,
      icon: <TrendingDown className="h-5 w-5" />,
      chartColor: '#F59E0B',
      description: t('allTimeExpenses'),
      format: "currency" as const
    },
    {
      title: t('occupancyRate'),
      value: `${data.occupancyRate.toFixed(1)}%`,
      trend: data.occupancyRateTrend,
      format: "percent" as const,
      icon: <Home className="h-5 w-5" />,
      chartColor: '#3B82F6',
      description: t('occupancyRateDescription')
    },
    {
      title: t('unpaidRent'),
      value: formatCurrency(data.unpaidRent),
      trend: data.unpaidRentTrend,
      isNegativeBetter: true,
      icon: <BanknoteIcon className="h-5 w-5" />,
      chartColor: '#EF4444',
      description: t('unpaidRentDescription'),
      format: "currency" as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced header section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-2">
          {t('financialOverview')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {t('selectedYear')}: {selectedYear}
        </p>
      </motion.div>

      {/* Enhanced metrics grid with staggered animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <FinancialMetricCard {...metric} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FinancialMetrics;
