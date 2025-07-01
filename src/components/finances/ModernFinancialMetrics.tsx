
import { useFinancialMetricsData } from "./metrics/useFinancialMetricsData";
import { ModernMetricCard } from "../maintenance/financials/components/ModernMetricCard";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { NoPropertySelected } from "./metrics/NoPropertySelected";
import { ErrorState } from "./metrics/ErrorState";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DollarSign, Home, BanknoteIcon, TrendingDown } from "lucide-react";
import { formatCurrencyFrench } from "@/lib/utils";
import { motion } from "framer-motion";

interface ModernFinancialMetricsProps {
  propertyId: string | null;
  selectedYear: number;
}

const ModernFinancialMetrics = ({ propertyId, selectedYear }: ModernFinancialMetricsProps) => {
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
      value: formatCurrencyFrench(data.totalIncome),
      description: t('allTimeIncome'),
      icon: <DollarSign className="h-5 w-5" />,
      chartColor: '#22C55E',
    },
    {
      title: t('totalExpenses'),
      value: formatCurrencyFrench(data.totalExpenses),
      description: t('allTimeExpenses'),
      icon: <TrendingDown className="h-5 w-5" />,
      chartColor: '#F59E0B',
    },
    {
      title: t('occupancyRate'),
      value: `${Math.round(data.occupancyRate)}%`,
      description: t('occupancyRateDescription'),
      icon: <Home className="h-5 w-5" />,
      chartColor: '#3B82F6',
    },
    {
      title: t('unpaidRent'),
      value: formatCurrencyFrench(data.unpaidRent),
      description: t('unpaidRentDescription'),
      icon: <BanknoteIcon className="h-5 w-5" />,
      chartColor: '#EF4444',
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center sm:text-left mb-8"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-2">
          {t('financialOverview')}
        </h2>
      </motion.div>

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
            <ModernMetricCard {...metric} index={index} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModernFinancialMetrics;
