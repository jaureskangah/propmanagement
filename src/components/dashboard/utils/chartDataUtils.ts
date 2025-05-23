import { subMonths, isWithinInterval } from "date-fns";
import { DateRange } from "../DashboardDateFilter";

export const generateMonthlyData = (data: any[], valueKey: string = 'amount') => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      value: 0
    };
  }).reverse();

  data.forEach(item => {
    const date = new Date(item.created_at);
    const monthIndex = last6Months.findIndex(m => 
      m.month === date.getMonth() && m.year === date.getFullYear()
    );
    if (monthIndex !== -1) {
      last6Months[monthIndex].value += Number(item[valueKey] || 0);
    }
  });

  return last6Months;
};

export const filterDataByDateRange = (data: any[], dateRange: DateRange) => {
  return data?.filter(item => 
    isWithinInterval(new Date(item.created_at), {
      start: dateRange.startDate,
      end: dateRange.endDate
    })
  ) || [];
};

export const calculateOccupancyData = (
  propertiesData: any[],
  tenantsData: any[],
  dateRange: DateRange
) => {
  const totalUnits = propertiesData?.reduce((acc, property) => acc + (property.units || 0), 0) || 0;
  const occupiedUnits = tenantsData.length;
  const globalOccupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  const previousMonthTenants = tenantsData.filter(tenant => 
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