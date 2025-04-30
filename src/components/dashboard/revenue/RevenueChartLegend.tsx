
import { useLocale } from "@/components/providers/LocaleProvider";
import { chartColors } from "./chartColors";

export const RevenueChartLegend = () => {
  const { t } = useLocale();
  const { revenueColor, expensesColor } = chartColors;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 transition-transform duration-300 hover:scale-105">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: revenueColor }} />
        <span className="text-xs text-muted-foreground">{t('revenue')}</span>
      </div>
      <div className="flex items-center gap-1.5 transition-transform duration-300 hover:scale-105">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: expensesColor }} />
        <span className="text-xs text-muted-foreground">{t('expenses')}</span>
      </div>
    </div>
  );
};
