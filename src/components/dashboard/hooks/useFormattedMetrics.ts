
import { MetricsData } from "../metrics/types";

interface FormattedMetricsInput {
  propertiesTotal: number;
  newProperties: number;
  propertiesChartData: Array<{ value: number }>;
  tenantsTotal: number;
  occupancyRate: number; 
  tenantsChartData: Array<{ value: number }>;
  pendingMaintenance: number;
  maintenanceChartData: Array<{ value: number }>;
  communicationsChartData: Array<{ value: number }>;
  // NEW: Add period context for better descriptions
  isFiltered?: boolean;
}

export const useFormattedMetrics = ({
  propertiesTotal,
  newProperties,
  propertiesChartData,
  tenantsTotal,
  occupancyRate,
  tenantsChartData,
  pendingMaintenance,
  maintenanceChartData,
  communicationsChartData,
  isFiltered = true
}: FormattedMetricsInput): MetricsData => {
  
  console.log("🔍 DEBUG: useFormattedMetrics - Input data:", {
    propertiesTotal,
    newProperties,
    tenantsTotal,
    occupancyRate,
    pendingMaintenance,
    isFiltered,
    chartDataLengths: {
      properties: propertiesChartData?.length,
      tenants: tenantsChartData?.length,
      maintenance: maintenanceChartData?.length,
      communications: communicationsChartData?.length
    }
  });

  const result = {
    properties: {
      total: propertiesTotal, // Global total (unchanged)
      new: newProperties, // Now filtered by period
      chartData: propertiesChartData
    },
    tenants: {
      total: tenantsTotal, // Global total (unchanged)
      occupancyRate: occupancyRate, // Global rate (unchanged)
      chartData: tenantsChartData
    },
    maintenance: {
      pending: pendingMaintenance, // Now filtered by period
      chartData: maintenanceChartData
    },
    communications: {
      chartData: communicationsChartData
    }
  };

  console.log("🔍 DEBUG: useFormattedMetrics - Formatted result:", result);

  return result;
};
