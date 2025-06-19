
import { useFinancialMetricsData } from "./metrics/useFinancialMetricsData";
import { FinancialMetricCard } from "./metrics/FinancialMetricCard";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { NoPropertySelected } from "./metrics/NoPropertySelected";
import { ErrorState } from "./metrics/ErrorState";
import { YearFilter } from "./YearFilter";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DollarSign, Home, BanknoteIcon, TrendingDown } from "lucide-react";
import { formatCurrencyFrench } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface FinancialMetricsProps {
  propertyId: string | null;
  selectedYear?: number;
}

const FinancialMetrics = ({ propertyId, selectedYear: initialYear }: FinancialMetricsProps) => {
  const { t } = useLocale();
  const [selectedYear, setSelectedYear] = useState(initialYear || new Date().getFullYear());
  const { data, isLoading, error, refetch } = useFinancialMetricsData(propertyId, selectedYear);

  const handleRetry = () => {
    refetch();
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
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
      trend: data.incomeTrend,
      icon: <DollarSign className="h-5 w-5" />,
      chartColor: '#22C55E',
      description: t('allTimeIncome'),
      format: "currency" as const
    },
    {
      title: t('totalExpenses'),
      value: formatCurrencyFrench(data.totalExpenses),
      trend: data.expensesTrend,
      isNegativeBetter: true,
      icon: <TrendingDown className="h-5 w-5" />,
      chartColor: '#F59E0B',
      description: t('allTimeExpenses'),
      format: "currency" as const
    },
    {
      title: t('occupancyRate'),
      value: `${Math.round(data.occupancyRate)}%`,
      trend: data.occupancyRateTrend,
      format: "percent" as const,
      icon: <Home className="h-5 w-5" />,
      chartColor: '#3B82F6',
      description: t('occupancyRateDescription')
    },
    {
      title: t('unpaidRent'),
      value: formatCurrencyFrench(data.unpaidRent),
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
      {/* Enhanced header section with year filter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
      >
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-2">
            {t('financialOverview')}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <YearFilter 
            selectedYear={selectedYear} 
            onYearChange={handleYearChange}
          />
        </div>
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
