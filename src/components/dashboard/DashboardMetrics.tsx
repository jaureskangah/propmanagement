
import { useMetricsData } from "@/hooks/dashboard/useMetricsData";
import { NotificationBell } from "./NotificationBell";
import { EnhancedMetricsGrid } from "./metrics/EnhancedMetricsGrid";
import { UnreadMessagesDialog } from "./notifications/UnreadMessagesDialog";
import { DateRange } from "./DashboardDateFilter";

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
    maintenanceRequests,
    totalNotificationCount,
    showUnreadDialog,
    setShowUnreadDialog,
    markAllMessagesAsRead,
    refreshMaintenanceRequests
  } = useMetricsData(propertiesData, maintenanceData, tenantsData, dateRange);

  // Handle dialog close with read status update
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && showUnreadDialog) {
      markAllMessagesAsRead();
      refreshMaintenanceRequests();
    }
    setShowUnreadDialog(open);
  };

  return (
    <div className="relative">
      {/* Notification bell removed from dashboard overview */}
      {/* <NotificationBell 
        unreadCount={totalNotificationCount} 
        maintenanceRequests={maintenanceRequests}
      /> */}
      <EnhancedMetricsGrid 
        metrics={metrics} 
        dateRange={dateRange}
      />
      
      <UnreadMessagesDialog 
        open={showUnreadDialog} 
        onOpenChange={handleDialogOpenChange}
      />
    </div>
  );
};
