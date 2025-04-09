
import { DateRange } from "../DashboardDateFilter";
import { filterDataByDateRange } from "../utils/chartDataUtils";
import { useEffect } from "react";

export const useCommunicationsMetrics = (tenantsData: any[], dateRange?: DateRange) => {
  // Filter tenant data by date range if provided
  const filteredTenantsData = dateRange 
    ? filterDataByDateRange(tenantsData, dateRange)
    : tenantsData;

  // Calculate unread messages
  const unreadMessages = filteredTenantsData.reduce((acc, tenant) => {
    const unreadCount = tenant.tenant_communications?.filter(
      (comm: any) => comm.status === 'unread' && comm.is_from_tenant
    ).length || 0;
    return acc + unreadCount;
  }, 0);

  // Generate communications chart data based on communications within the date range
  const communicationsChartData = [];
  
  // Create 7 data points for the chart, spread evenly across the date range
  if (dateRange) {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const timeSpan = endDate.getTime() - startDate.getTime();
    
    // Create an array of dates spanning the range
    for (let i = 0; i < 7; i++) {
      const pointDate = new Date(startDate.getTime() + (timeSpan * i / 6));
      
      // Count communications up to this date
      const communicationsUpToDate = filteredTenantsData.reduce((acc, tenant) => {
        const commCount = (tenant.tenant_communications || []).filter((comm: any) => {
          const commDate = new Date(comm.created_at);
          return commDate <= pointDate && comm.status === 'unread' && comm.is_from_tenant;
        }).length;
        return acc + commCount;
      }, 0);
      
      communicationsChartData.push({
        value: communicationsUpToDate
      });
    }
  } else {
    // Fallback if no date range - this creates placeholder data
    for (let i = 0; i < 7; i++) {
      communicationsChartData.push({
        value: i === 6 ? unreadMessages : Math.max(0, Math.floor(unreadMessages * i / 7))
      });
    }
  }

  useEffect(() => {
    console.log("Communications metrics calculated:", {
      unreadMessages,
      chartDataPoints: communicationsChartData.length,
      dateRangeStart: dateRange?.startDate,
      dateRangeEnd: dateRange?.endDate
    });
  }, [unreadMessages, communicationsChartData, dateRange]);

  return {
    unreadMessages,
    communicationsChartData
  };
};
