
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

export const RevenueChartTooltip = ({ active, payload, label }: any) => {
  const { t } = useLocale();
  
  if (!active || !payload || !payload.length) {
    return null;
  }
  
  console.log("RevenueChartTooltip payload:", payload);

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-card/95 backdrop-blur-sm border border-border/30 shadow-md rounded-lg p-3 text-sm"
    >
      <p className="font-medium text-center mb-2 text-primary">{label}</p>
      <div className="space-y-2">
        {revenue && (
          <div className="flex justify-between items-center gap-4 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-primary/80 group-hover:text-primary transition-colors">{t('revenue')}:</span>
            </div>
            <motion.span 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="font-medium"
            >
              ${Number(revenueValue).toLocaleString()}
            </motion.span>
          </div>
        )}
        {expenses && (
          <div className="flex justify-between items-center gap-4 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-red-500/80 group-hover:text-red-500 transition-colors">{t('expenses')}:</span>
            </div>
            <motion.span 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="font-medium"
            >
              ${Number(expensesValue).toLocaleString()}
            </motion.span>
          </div>
        )}
        <div className="border-t border-border pt-2 mt-1">
          <div className="flex justify-between items-center gap-4 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-green-500/80 group-hover:text-green-500 transition-colors font-medium">{t('profit')}:</span>
            </div>
            <motion.span 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="font-medium"
            >
              ${Number(profitValue).toLocaleString()}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
