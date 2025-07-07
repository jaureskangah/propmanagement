import { DateRange } from "../DashboardDateFilter";
import { filterDataByDateRange, calculateOccupancyData, generateMonthlyData } from "../utils/chartDataUtils";

export const useMetricsCalculation = (
  propertiesData: any[],
  maintenanceData: any[],
  tenantsData: any[],
  dateRange: DateRange
) => {
  // Ensure input data is valid
  const validPropertiesData = Array.isArray(propertiesData) ? propertiesData : [];
  const validMaintenanceData = Array.isArray(maintenanceData) ? maintenanceData : [];
  const validTenantsData = Array.isArray(tenantsData) ? tenantsData : [];

  console.log("🔍 DEBUG: useMetricsCalculation - Input data:", {
    propertiesCount: validPropertiesData.length,
    maintenanceCount: validMaintenanceData.length,
    tenantsCount: validTenantsData.length,
    dateRange: {
      start: dateRange.startDate.toISOString(),
      end: dateRange.endDate.toISOString()
    }
  });

  // Filter data by date range for KPI calculations (NEW - CRITICAL FIX)
  const filteredPropertiesData = filterDataByDateRange(validPropertiesData, dateRange);
  const filteredMaintenanceData = filterDataByDateRange(validMaintenanceData, dateRange);
  const filteredTenantsData = filterDataByDateRange(validTenantsData, dateRange);

  console.log("🔍 DEBUG: useMetricsCalculation - Filtered data:", {
    filteredPropertiesCount: filteredPropertiesData.length,
    filteredMaintenanceCount: filteredMaintenanceData.length,
    filteredTenantsCount: filteredTenantsData.length
  });

  // Calculate occupancy data using ALL tenants (not filtered by date) - GLOBAL METRIC
  const {
    globalOccupancyRate,
    totalUnits,
    occupiedUnits
  } = calculateOccupancyData(validPropertiesData, validTenantsData, dateRange);

  // Calculate new properties for the SELECTED PERIOD (FIXED)
  const newPropertiesInPeriod = filteredPropertiesData.length;

  console.log("🔍 DEBUG: useMetricsCalculation - New properties calculation:", {
    originalMethod: filterDataByDateRange(validPropertiesData, {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    }).length,
    newMethod: newPropertiesInPeriod,
    periodUsed: "selected_date_range"
  });

  // Calculate pending maintenance for the SELECTED PERIOD (FIXED)
  const pendingMaintenanceInPeriod = filteredMaintenanceData.filter(req => 
    (req.status === "Pending" || req.status === "pending") && req.status !== "Resolved"
  ).length;

  // Fallback: if no filtered data, use global pending maintenance
  const pendingMaintenanceFallback = validMaintenanceData.filter(req => 
    (req.status === "Pending" || req.status === "pending") && req.status !== "Resolved"
  ).length;

  const finalPendingMaintenance = filteredMaintenanceData.length > 0 
    ? pendingMaintenanceInPeriod 
    : pendingMaintenanceFallback;

  console.log("🔍 DEBUG: useMetricsCalculation - Pending maintenance calculation:", {
    pendingInPeriod: pendingMaintenanceInPeriod,
    pendingGlobal: pendingMaintenanceFallback,
    finalValue: finalPendingMaintenance,
    filteredDataLength: filteredMaintenanceData.length
  });

  // Generate chart data with proper monthly evolution (unchanged)
  const tenantsMonthlyData = generateMonthlyData(validTenantsData);
  const propertiesMonthlyData = generateMonthlyData(validPropertiesData);
  const maintenanceMonthlyData = generateMonthlyData(validMaintenanceData);

  // Format chart data for display
  const tenantsChartData = tenantsMonthlyData.map(m => ({ 
    date: m.monthName,
    value: m.value,
    month: m.monthName
  }));
  
  const propertiesChartData = propertiesMonthlyData.map(m => ({ 
    date: m.monthName,
    value: m.value,
    month: m.monthName
  }));
  
  const maintenanceChartData = maintenanceMonthlyData.map(m => ({ 
    date: m.monthName,
    value: m.value,
    month: m.monthName
  }));

  const result = {
    globalOccupancyRate,
    totalUnits,
    occupiedUnits,
    newPropertiesThisMonth: newPropertiesInPeriod, // RENAMED and FIXED
    pendingMaintenance: finalPendingMaintenance, // FIXED
    tenantsChartData,
    propertiesChartData,
    maintenanceChartData,
    validTenantsData,
  };

  console.log("🔍 DEBUG: useMetricsCalculation - Final result:", result);

  return result;
};
