
import { useEffect } from 'react';
import { DateRange } from "@/components/dashboard/DashboardDateFilter";
import { useMetricsData as useBaseMetricsData } from "@/components/dashboard/hooks/useMetricsData";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export const useMetricsData = (
  propertiesData: any[],
  maintenanceData: any[],
  tenantsData: any[],
  dateRange: DateRange
) => {
  const { metrics, unreadMessages: staticUnreadMessages } = useBaseMetricsData(
    propertiesData,
    maintenanceData,
    tenantsData,
    dateRange
  );
  
  const { 
    unreadMessages, 
    maintenanceRequests,
    totalNotificationCount,
    showUnreadDialog, 
    setShowUnreadDialog,
    markAllMessagesAsRead,
    refreshUnreadMessages,
    refreshMaintenanceRequests
  } = useRealtimeNotifications();

  useEffect(() => {
    console.log("Metrics data:", { 
      staticUnreadMessages, 
      totalNotificationCount,
      unreadMessages 
    });
  }, [staticUnreadMessages, totalNotificationCount, unreadMessages]);

  return {
    metrics,
    unreadMessages,
    maintenanceRequests,
    totalNotificationCount,
    showUnreadDialog,
    setShowUnreadDialog,
    markAllMessagesAsRead,
    refreshUnreadMessages,
    refreshMaintenanceRequests,
    staticUnreadMessages
  };
};
