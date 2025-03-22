
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
  communicationsChartData
}: FormattedMetricsInput): MetricsData => {
  return {
    properties: {
      total: propertiesTotal,
      new: newProperties,
      chartData: propertiesChartData
    },
    tenants: {
      total: tenantsTotal,
      occupancyRate: occupancyRate,
      chartData: tenantsChartData
    },
    maintenance: {
      pending: pendingMaintenance,
      chartData: maintenanceChartData
    },
    communications: {
      chartData: communicationsChartData
    }
  };
};
