
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

// Helper function to generate chart data (used by the hook)
export const getMaintenanceChartData = (propertyId: string): MaintenanceChartData[] => {
  // This is a placeholder function that would normally fetch real data
  // In a real app, this would be replaced by actual API calls
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    requests: Math.floor(Math.random() * 15) + 1,
    completed: Math.floor(Math.random() * 10),
    urgent: Math.floor(Math.random() * 5),
    expenses: Math.floor(Math.random() * 1000) + 200
  }));
};

// Function to translate month names based on the selected language
export const formatMonthsForLocale = (data: MaintenanceChartData[], language: string): MaintenanceChartData[] => {
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

  if (language === 'fr') {
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
      theme: { light: chartColors.revenueColor, dark: chartColors.revenueColor }
    },
    completedRequests: {
      label: t('completedMaintenanceRequests'),
      theme: { light: chartColors.profitColor, dark: chartColors.profitColor }
    },
    urgentRequests: {
      label: t('urgentMaintenanceRequests'),
      theme: { light: chartColors.expensesColor, dark: chartColors.expensesColor }
    }
  };
};

// Hook to get expenses chart configuration
export const useExpensesChartConfig = () => {
  const { t } = useLocale();
  
  return {
    expenses: {
      label: t('maintenanceExpenses'),
      theme: { light: chartColors.pendingColor, dark: chartColors.pendingColor }
    }
  };
};
