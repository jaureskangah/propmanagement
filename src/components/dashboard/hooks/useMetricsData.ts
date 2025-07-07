
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
  console.log("🔍 DEBUG: useMetricsData - Starting with date range:", {
    startDate: dateRange.startDate.toISOString(),
    endDate: dateRange.endDate.toISOString(),
    dataLengths: {
      properties: Array.isArray(propertiesData) ? propertiesData.length : 0,
      maintenance: Array.isArray(maintenanceData) ? maintenanceData.length : 0,
      tenants: Array.isArray(tenantsData) ? tenantsData.length : 0
    }
  });

  // Use the calculation hook to process data
  const {
    globalOccupancyRate,
    newPropertiesThisMonth, // Now filtered by period
    pendingMaintenance, // Now filtered by period
    tenantsChartData,
    propertiesChartData,
    maintenanceChartData,
    validTenantsData,
  } = useMetricsCalculation(propertiesData, maintenanceData, tenantsData, dateRange);

  // Use the communications hook to get communications data, passing the date range
  const { unreadMessages, communicationsChartData } = useCommunicationsMetrics(validTenantsData, dateRange);

  // Logging for debugging the impact of date range changes
  useEffect(() => {
    console.log("🔍 DEBUG: useMetricsData - KPI Impact Analysis:", {
      dateRange: {
        start: dateRange.startDate.toISOString(),
        end: dateRange.endDate.toISOString()
      },
      kpiValues: {
        propertiesTotal: Array.isArray(propertiesData) ? propertiesData.length : 0,
        newPropertiesInPeriod: newPropertiesThisMonth,
        tenantsTotal: validTenantsData.length,
        occupancyRate: globalOccupancyRate || 0,
        pendingMaintenanceInPeriod: pendingMaintenance
      },
      chartDataLengths: {
        properties: propertiesChartData?.length,
        tenants: tenantsChartData?.length,
        maintenance: maintenanceChartData?.length,
        communications: communicationsChartData?.length
      }
    });
  }, [propertiesData, maintenanceData, tenantsData, dateRange, 
      newPropertiesThisMonth, pendingMaintenance, globalOccupancyRate,
      propertiesChartData, tenantsChartData, maintenanceChartData, communicationsChartData]);

  // Format the metrics into the required structure
  const metrics = useFormattedMetrics({
    propertiesTotal: Array.isArray(propertiesData) ? propertiesData.length : 0,
    newProperties: newPropertiesThisMonth, // Now correctly filtered
    propertiesChartData,
    tenantsTotal: validTenantsData.length,
    occupancyRate: globalOccupancyRate || 0,
    tenantsChartData,
    pendingMaintenance, // Now correctly filtered
    maintenanceChartData,
    communicationsChartData,
    isFiltered: true // Indicate that period filtering is active
  });

  console.log("🔍 DEBUG: useMetricsData - Final metrics output:", {
    hasMetrics: !!metrics,
    metricsKeys: Object.keys(metrics || {}),
    unreadMessagesCount: unreadMessages
  });

  return {
    metrics,
    unreadMessages
  };
};
