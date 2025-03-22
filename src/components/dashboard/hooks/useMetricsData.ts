
import { DateRange } from "../DashboardDateFilter";
import { useEffect } from "react";
import { useMetricsCalculation } from "./useMetricsCalculation";
import { useCommunicationsMetrics } from "./useCommunicationsMetrics";
import { useFormattedMetrics } from "./useFormattedMetrics";

export const useMetricsData = (
  propertiesData: any[],
  maintenanceData: any[],
  tenantsData: any[],
  dateRange: DateRange
) => {
  // Use the calculation hook to process data
  const {
    globalOccupancyRate,
    newPropertiesThisMonth,
    pendingMaintenance,
    tenantsChartData,
    propertiesChartData,
    maintenanceChartData,
    validTenantsData,
  } = useMetricsCalculation(propertiesData, maintenanceData, tenantsData, dateRange);

  // Use the communications hook to get communications data
  const { unreadMessages, communicationsChartData } = useCommunicationsMetrics(validTenantsData);

  // Logging for debugging
  useEffect(() => {
    console.log("useMetricsData input:", {
      propertiesLength: Array.isArray(propertiesData) ? propertiesData.length : 0,
      maintenanceLength: Array.isArray(maintenanceData) ? maintenanceData.length : 0,
      tenantsLength: Array.isArray(tenantsData) ? tenantsData.length : 0,
      dateRange
    });
  }, [propertiesData, maintenanceData, tenantsData, dateRange]);

  // Format the metrics into the required structure
  const metrics = useFormattedMetrics({
    propertiesTotal: Array.isArray(propertiesData) ? propertiesData.length : 0,
    newProperties: newPropertiesThisMonth,
    propertiesChartData,
    tenantsTotal: validTenantsData.length,
    occupancyRate: globalOccupancyRate || 0,
    tenantsChartData,
    pendingMaintenance,
    maintenanceChartData,
    communicationsChartData
  });

  return {
    metrics,
    unreadMessages
  };
};
