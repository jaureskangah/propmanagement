
import { useLocale } from "@/components/providers/LocaleProvider";

export const RevenueChartTooltip = ({ active, payload, label }: any) => {
  const { t } = useLocale();
  
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Get the appropriate data depending on which data keys are present
  const revenue = payload.find((p: any) => p.dataKey === 'amount' || p.dataKey === 'income');
  const expenses = payload.find((p: any) => p.dataKey === 'expenses' || p.dataKey === 'expense');
  const profit = payload.find((p: any) => p.dataKey === 'profit');
  
  // Calculate the profit value
  const revenueValue = revenue?.value || 0;
  const expensesValue = expenses?.value || 0;
  
  // Use the profit value directly from the data if available, otherwise calculate it
  const profitValue = profit ? profit.value : revenueValue - expensesValue;

  // Log for debugging
  console.log("Tooltip data:", { 
    label, 
    payload, 
    revenue, 
    expenses, 
    profit,
    revenueValue,
    expensesValue,
    profitValue
  });

  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border/30 shadow-md rounded-lg p-3 text-sm">
      <p className="font-medium text-center mb-1">{label}</p>
      <div className="space-y-1">
        {revenue && (
          <p className="flex justify-between gap-4">
            <span className="text-primary/80">{t('revenue')}:</span>
            <span className="font-medium">${Number(revenueValue).toLocaleString()}</span>
          </p>
        )}
        {expenses && (
          <p className="flex justify-between gap-4">
            <span className="text-red-500/80">{t('expenses')}:</span>
            <span className="font-medium">${Number(expensesValue).toLocaleString()}</span>
          </p>
        )}
        <div className="border-t border-border pt-1 mt-1">
          <p className="flex justify-between gap-4 font-medium">
            <span className="text-green-500/80">{t('profit')}:</span>
            <span>${Number(profitValue).toLocaleString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
