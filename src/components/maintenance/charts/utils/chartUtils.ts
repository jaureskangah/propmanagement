
import { useLocale } from "@/components/providers/LocaleProvider";
import { chartColors } from "@/components/dashboard/revenue/chartColors";

// Chart data type
export interface MaintenanceChartData {
  month: string;
  requests: number;
  completed: number;
  urgent: number;
  expenses: number;
}

// Function to translate month names based on the selected locale
export const formatMonthsForLocale = (data: MaintenanceChartData[], locale: string): MaintenanceChartData[] => {
  const frenchMonths: Record<string, string> = {
    'Jan': 'Jan',
    'Feb': 'Fév',
    'Mar': 'Mar',
    'Apr': 'Avr',
    'May': 'Mai',
    'Jun': 'Juin',
    'Jul': 'Juil',
    'Aug': 'Août',
    'Sep': 'Sep',
    'Oct': 'Oct',
    'Nov': 'Nov',
    'Dec': 'Déc'
  };

  if (locale === 'fr') {
    return data.map(item => ({
      ...item,
      month: frenchMonths[item.month] || item.month
    }));
  }
  
  return data;
};

// Hook to get chart configuration with proper translations and colors
export const useMaintenanceChartConfig = () => {
  const { t } = useLocale();
  
  return {
    totalRequests: {
      label: t('totalMaintenanceRequests'),
      theme: { light: chartColors.incomeColor, dark: chartColors.incomeColorDark }
    },
    completedRequests: {
      label: t('completedMaintenanceRequests'),
      theme: { light: chartColors.profitColor, dark: chartColors.profitColorDark }
    },
    urgentRequests: {
      label: t('urgentMaintenanceRequests'),
      theme: { light: chartColors.expenseColor, dark: chartColors.expenseColorDark }
    }
  };
};

// Hook to get expenses chart configuration
export const useExpensesChartConfig = () => {
  const { t } = useLocale();
  
  return {
    expenses: {
      label: t('maintenanceExpenses'),
      theme: { light: chartColors.pendingColor, dark: chartColors.pendingColorDark }
    }
  };
};
