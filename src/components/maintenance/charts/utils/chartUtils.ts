
import { useLocale } from "@/components/providers/LocaleProvider";

// Chart data type
export interface MaintenanceChartData {
  month: string;
  requests: number;
  completed: number;
  urgent: number;
  expenses: number;
}

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

// Hook to get chart configuration with proper translations
export const useMaintenanceChartConfig = () => {
  const { t } = useLocale();
  
  return {
    totalRequests: {
      label: t('totalMaintenanceRequests'),
      theme: { light: "#8884d8", dark: "#a393f0" }
    },
    completedRequests: {
      label: t('completedMaintenanceRequests'),
      theme: { light: "#4ade80", dark: "#22c55e" }
    },
    urgentRequests: {
      label: t('urgentMaintenanceRequests'),
      theme: { light: "#ef4444", dark: "#f87171" }
    },
    expenses: {
      label: t('maintenanceExpenses'),
      theme: { light: "#82ca9d", dark: "#86efac" }
    }
  };
};

// Hook to get expenses chart configuration
export const useExpensesChartConfig = () => {
  const { t } = useLocale();
  
  return {
    expenses: {
      label: t('maintenanceExpenses'),
      theme: { light: "#82ca9d", dark: "#86efac" }
    }
  };
};
