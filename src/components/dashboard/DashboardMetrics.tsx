
import { useMetricsData } from "@/hooks/dashboard/useMetricsData";
import { NotificationBell } from "./NotificationBell";
import { MetricsGrid } from "./metrics/MetricsGrid";
import { UnreadMessagesDialog } from "./notifications/UnreadMessagesDialog";
import { DateRange } from "./DashboardDateFilter";
import { useEffect, useState } from "react";

interface DashboardMetricsProps {
  propertiesData: any[];
  maintenanceData: any[];
  tenantsData: any[];
  dateRange: DateRange;
}

export const DashboardMetrics = ({ 
  propertiesData, 
  maintenanceData, 
  tenantsData,
  dateRange 
}: DashboardMetricsProps) => {
  const { 
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
  } = useMetricsData(propertiesData, maintenanceData, tenantsData, dateRange);

  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    // Combine static and realtime notifications
    const realtimeCount = totalNotificationCount || 0;
    console.log("Unread count calculation:", { 
      staticUnreadMessages, 
      realtimeCount,
      totalNotificationCount,
      realtimeMessages: unreadMessages,
      dateRange
    });
    
    setTotalUnreadCount(
      Math.max(staticUnreadMessages, realtimeCount)
    );
  }, [staticUnreadMessages, totalNotificationCount, unreadMessages, dateRange]);

  // Handle dialog close with read status update
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && showUnreadDialog) {
      markAllMessagesAsRead();
      // Force refresh notifications to immediately update the count
      refreshUnreadMessages();
      refreshMaintenanceRequests();
    }
    setShowUnreadDialog(open);
  };

  return (
    <div className="relative">
      <NotificationBell 
        unreadCount={totalUnreadCount} 
        unreadMessages={unreadMessages} 
        maintenanceRequests={maintenanceRequests}
        onShowAllNotifications={() => setShowUnreadDialog(true)}
      />
      <MetricsGrid 
        metrics={metrics} 
        unreadMessages={totalUnreadCount}
        dateRange={dateRange}
      />
      
      <UnreadMessagesDialog 
        open={showUnreadDialog} 
        onOpenChange={handleDialogOpenChange} 
        unreadMessages={unreadMessages || []} 
      />
    </div>
  );
};
