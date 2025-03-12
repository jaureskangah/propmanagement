
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
      <div className="rounded-lg border bg-background p-3 shadow-md animate-fade-in text-xs">
        <p className="font-semibold mb-1.5">{label}</p>
        <div className="space-y-1">
          <div className="grid grid-cols-2 gap-1.5">
            <span className="text-muted-foreground">{t('revenue')}:</span>
            <span className="font-medium text-blue-500">
              ${revenue.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <span className="text-muted-foreground">{t('expenses')}:</span>
            <span className="font-medium text-blue-300">
              ${expenses.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 border-t pt-1 mt-1">
            <span className="text-muted-foreground">{t('profit')}:</span>
            <span className={cn(
              "font-medium",
              profit > 0 ? "text-green-500" : "text-red-500"
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
