
import { useLocale } from "@/components/providers/LocaleProvider";

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

// Mock data - this would be replaced with actual API data
export const getMaintenanceChartData = (propertyId: string): MaintenanceChartData[] => {
  console.log("Fetching chart data for property:", propertyId);
  
  // This is mock data - in a real app, this would be fetched from an API
  return [
    { month: "Jan", requests: 4, completed: 3, urgent: 1, expenses: 400 },
    { month: "Feb", requests: 3, completed: 2, urgent: 0, expenses: 300 },
    { month: "Mar", requests: 5, completed: 4, urgent: 2, expenses: 550 },
    { month: "Apr", requests: 2, completed: 2, urgent: 0, expenses: 200 },
    { month: "May", requests: 7, completed: 5, urgent: 3, expenses: 650 },
    { month: "Jun", requests: 4, completed: 3, urgent: 1, expenses: 450 },
  ];
};

// Hook to get chart configuration with proper translations and colors like in Finance page
export const useMaintenanceChartConfig = () => {
  const { t } = useLocale();
  
  return {
    totalRequests: {
      label: t('totalMaintenanceRequests'),
      theme: { light: "#3B82F6", dark: "#60A5FA" } // Blue like in Finance charts
    },
    completedRequests: {
      label: t('completedMaintenanceRequests'),
      theme: { light: "#22C55E", dark: "#4ADE80" } // Green like in Finance charts
    },
    urgentRequests: {
      label: t('urgentMaintenanceRequests'),
      theme: { light: "#EF4444", dark: "#F87171" } // Red like in Finance charts
    },
    expenses: {
      label: t('maintenanceExpenses'),
      theme: { light: "#F59E0B", dark: "#FBBF24" } // Amber like in Finance charts
    }
  };
};

// Hook to get expenses chart configuration
export const useExpensesChartConfig = () => {
  const { t } = useLocale();
  
  return {
    expenses: {
      label: t('maintenanceExpenses'),
      theme: { light: "#F59E0B", dark: "#FBBF24" } // Amber like in Finance charts
    }
  };
};
