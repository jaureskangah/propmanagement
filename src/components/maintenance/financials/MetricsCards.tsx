
import { FileText, TrendingUp, Wallet } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MetricCard } from "./components/MetricCard";
import { useFinancialCalculations } from "./hooks/useFinancialCalculations";

interface MetricsCardsProps {
  expenses: any[];
  maintenance: any[];
  rentData: any[];
}

export const MetricsCards = ({ expenses, maintenance, rentData }: MetricsCardsProps) => {
  const { t } = useLocale();
  const { calculateROI, calculateTotalExpenses, calculateTotalIncome } = useFinancialCalculations({
    expenses,
    maintenance,
    rentData
  });

  const totalExpenses = calculateTotalExpenses();
  const totalIncome = calculateTotalIncome();
  const roi = calculateROI();

  const metrics = [
    {
      title: t('totalExpenses'),
      value: `$${totalExpenses.toLocaleString()}`,
      icon: <FileText className="h-4 w-4" />,
      description: t('yearToDate'),
      color: "text-rose-500",
      bgColor: "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
      borderColor: "border-rose-100 dark:border-rose-800/30 hover:border-rose-200 dark:hover:border-rose-700/40",
    },
    {
      title: t('roi', { fallback: 'ROI Annuel' }),
      value: `${roi}%`,
      icon: <TrendingUp className="h-4 w-4" />,
      description: t('annualReturn'),
      color: "text-blue-500",
      bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      borderColor: "border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/40",
    },
    {
      title: t('totalRentPaid'),
      value: `$${totalIncome.toLocaleString()}`,
      icon: <Wallet className="h-4 w-4" />,
      description: t('yearToDate'),
      color: "text-green-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      borderColor: "border-green-100 dark:border-green-800/30 hover:border-green-200 dark:hover:border-green-700/40",
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
};
