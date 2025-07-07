
import { subMonths, isWithinInterval, format } from "date-fns";
import { DateRange } from "../DashboardDateFilter";

export const generateMonthlyData = (data: any[], valueKey: string = 'amount') => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      monthName: format(date, 'MMM'),
      value: 0,
      date: format(date, 'yyyy-MM')
    };
  }).reverse();

  data.forEach(item => {
    const date = new Date(item.created_at);
    const monthIndex = last6Months.findIndex(m => 
      m.month === date.getMonth() && m.year === date.getFullYear()
    );
    if (monthIndex !== -1) {
      last6Months[monthIndex].value += Number(item[valueKey] || 1);
    }
  });

  return last6Months;
};

export const filterDataByDateRange = (data: any[], dateRange: DateRange) => {
  if (!Array.isArray(data) || !dateRange) {
    console.warn("🚨 filterDataByDateRange: Invalid input data or dateRange");
    return [];
  }

  const filteredData = data.filter(item => {
    if (!item || !item.created_at) {
      console.warn("🚨 filterDataByDateRange: Item missing created_at field", item);
      return false;
    }
    
    try {
      const itemDate = new Date(item.created_at);
      return isWithinInterval(itemDate, {
        start: dateRange.startDate,
        end: dateRange.endDate
      });
    } catch (error) {
      console.error("🚨 filterDataByDateRange: Error parsing date", item.created_at, error);
      return false;
    }
  });

  console.log("🔍 DEBUG: filterDataByDateRange result:", {
    inputLength: data.length,
    outputLength: filteredData.length,
    dateRange: {
      start: dateRange.startDate.toISOString(),
      end: dateRange.endDate.toISOString()
    }
  });

  return filteredData;
};

export const calculateOccupancyData = (
  propertiesData: any[],
  allTenantsData: any[], // Utiliser TOUS les locataires, pas seulement ceux filtrés
  dateRange: DateRange
) => {
  const totalUnits = propertiesData?.reduce((acc, property) => acc + (property.units || 0), 0) || 0;
  const occupiedUnits = allTenantsData.length; // Utiliser tous les locataires actifs
  const globalOccupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  console.log("🔍 DEBUG: calculateOccupancyData:", {
    totalUnits,
    occupiedUnits,
    globalOccupancyRate,
    allTenantsCount: allTenantsData.length
  });

  // Pour la tendance, utiliser les locataires filtrés par date (nouveaux locataires dans la période)
  const filteredTenantsForTrend = filterDataByDateRange(allTenantsData, dateRange);
  const previousMonthTenants = allTenantsData.filter(tenant => 
    isWithinInterval(new Date(tenant.created_at), {
      start: subMonths(dateRange.startDate, 1),
      end: subMonths(dateRange.endDate, 1)
    })
  ).length || 0;

  const occupancyTrend = previousMonthTenants > 0 
    ? Math.round(((occupiedUnits - previousMonthTenants) / previousMonthTenants) * 100)
    : 0;

  return { globalOccupancyRate, occupancyTrend, totalUnits, occupiedUnits };
};

// NEW: Utility function to calculate period-specific KPIs
export const calculatePeriodKPIs = (
  data: any[],
  dateRange: DateRange,
  type: 'properties' | 'maintenance' | 'tenants'
) => {
  const filteredData = filterDataByDateRange(data, dateRange);
  
  let count = 0;
  let pendingCount = 0;
  
  switch (type) {
    case 'properties':
      count = filteredData.length;
      break;
    case 'maintenance':
      count = filteredData.length;
      pendingCount = filteredData.filter(req => 
        (req.status === "Pending" || req.status === "pending") && req.status !== "Resolved"
      ).length;
      break;
    case 'tenants':
      count = filteredData.length;
      break;
  }
  
  console.log(`🔍 DEBUG: calculatePeriodKPIs for ${type}:`, {
    totalData: data.length,
    filteredData: filteredData.length,
    count,
    pendingCount,
    dateRange: {
      start: dateRange.startDate.toISOString(),
      end: dateRange.endDate.toISOString()
    }
  });
  
  return { count, pendingCount, filteredData };
};
