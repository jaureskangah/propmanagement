
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";

interface RevenueTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const RevenueChartTooltip = ({ active, payload, label }: RevenueTooltipProps) => {
  const { t } = useLocale();
  
  if (active && payload && payload.length) {
    const revenue = Number(payload[0].value);
    const expenses = Number(payload[1].value);
    const profit = revenue - expenses;
    
    return (
      <div className="rounded-lg border bg-card/90 dark:bg-gray-800/90 p-3 shadow-lg backdrop-blur-sm animate-fade-in text-xs">
        <p className="font-bold mb-1.5 text-xs text-primary dark:text-blue-300">{label}</p>
        <div className="space-y-1">
          <div className="grid grid-cols-2 gap-1.5">
            <span className="text-muted-foreground text-xs">{t('revenue')}:</span>
            <span className="font-medium text-blue-500 dark:text-blue-400 text-xs">
              ${revenue.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <span className="text-muted-foreground text-xs">{t('expenses')}:</span>
            <span className="font-medium text-rose-500 dark:text-rose-400 text-xs">
              ${expenses.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 border-t pt-1 mt-1 border-border dark:border-gray-600">
            <span className="text-muted-foreground text-xs">{t('profit')}:</span>
            <span className={cn(
              "font-medium text-xs",
              profit > 0 ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
            )}>
              ${profit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
