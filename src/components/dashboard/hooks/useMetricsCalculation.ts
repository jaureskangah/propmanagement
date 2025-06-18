
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

  // Filter data by date range for trend calculations
  const filteredMaintenanceData = filterDataByDateRange(validMaintenanceData, dateRange);
  const filteredTenantsData = filterDataByDateRange(validTenantsData, dateRange);

  // Calculate occupancy data using ALL tenants (not filtered by date)
  const {
    globalOccupancyRate,
    totalUnits,
    occupiedUnits
  } = calculateOccupancyData(validPropertiesData, validTenantsData, dateRange);

  // Calculate new properties this month
  const newPropertiesThisMonth = filterDataByDateRange(validPropertiesData, {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  }).length;

  // Pending maintenance requests - Assurez-vous que cela correspond à la page Maintenance
  const pendingMaintenance = validMaintenanceData.filter(req => 
    (req.status === "Pending" || req.status === "pending") && req.status !== "Resolved"
  ).length;

  // Generate chart data with proper monthly evolution
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

  return {
    globalOccupancyRate,
    totalUnits,
    occupiedUnits,
    newPropertiesThisMonth,
    pendingMaintenance,
    tenantsChartData,
    propertiesChartData,
    maintenanceChartData,
    validTenantsData,
  };
};
