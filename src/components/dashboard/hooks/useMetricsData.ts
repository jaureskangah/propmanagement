import { DateRange } from "../DashboardDateFilter";
import { generateMonthlyData, filterDataByDateRange, calculateOccupancyData } from "../utils/chartDataUtils";

export const useMetricsData = (
  propertiesData: any[],
  maintenanceData: any[],
  tenantsData: any[],
  dateRange: DateRange
) => {
  const filteredMaintenanceData = filterDataByDateRange(maintenanceData, dateRange);
  const filteredTenantsData = filterDataByDateRange(tenantsData, dateRange);

  const {
    globalOccupancyRate,
    occupancyTrend,
    totalUnits,
    occupiedUnits
  } = calculateOccupancyData(propertiesData, filteredTenantsData, dateRange);

  const newPropertiesThisMonth = filterDataByDateRange(propertiesData, dateRange).length;
  const pendingMaintenance = filteredMaintenanceData.filter(req => req.status === "Pending").length;
  const totalMonthlyRevenue = filteredTenantsData.reduce((acc, tenant) => acc + (tenant.rent_amount || 0), 0);

  // Generate chart data
  const occupancyChartData = generateMonthlyData(filteredTenantsData).map((m) => {
    const monthUnits = propertiesData.reduce((acc, property) => {
      const propertyDate = new Date(property.created_at);
      if (propertyDate.getMonth() <= m.month && propertyDate.getFullYear() <= m.year) {
        return acc + (property.units || 0);
      }
      return acc;
    }, 0);
    
    return {
      value: monthUnits > 0 ? Math.round((m.value / monthUnits) * 100) : 0
    };
  });

  const revenueChartData = generateMonthlyData(tenantsData, 'rent_amount');
  const maintenanceChartData = generateMonthlyData(maintenanceData);
  const tenantsChartData = generateMonthlyData(tenantsData).map(m => ({ value: m.value || 0 }));
  const propertiesChartData = generateMonthlyData(propertiesData).map(m => ({ 
    value: m.value > 0 ? 1 : 0
  }));

  const unreadMessages = filteredTenantsData.reduce((acc, tenant) => {
    const unreadCount = tenant.tenant_communications?.filter(
      (comm: any) => comm.status === 'unread' && comm.is_from_tenant
    ).length || 0;
    return acc + unreadCount;
  }, 0);

  return {
    metrics: {
      properties: {
        total: propertiesData?.length || 0,
        new: newPropertiesThisMonth,
        chartData: propertiesChartData
      },
      occupancy: {
        rate: globalOccupancyRate,
        trend: occupancyTrend,
        chartData: occupancyChartData
      },
      tenants: {
        total: filteredTenantsData.length,
        occupancyRate: globalOccupancyRate,
        chartData: tenantsChartData
      },
      maintenance: {
        pending: pendingMaintenance,
        chartData: maintenanceChartData
      },
      revenue: {
        monthly: totalMonthlyRevenue,
        chartData: revenueChartData
      }
    },
    unreadMessages
  };
};