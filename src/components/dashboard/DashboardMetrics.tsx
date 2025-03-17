
import { NotificationBell } from "./NotificationBell";
import { useMetricsData } from "./hooks/useMetricsData";
import { MetricsGrid } from "./metrics/MetricsGrid";
import type { DateRange } from "./DashboardDateFilter";
import { useEffect, useState } from "react";
import { UnreadMessagesDialog } from "./UnreadMessagesDialog";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

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
  const { metrics, unreadMessages: staticUnreadMessages } = useMetricsData(
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
    setShowUnreadDialog 
  } = useRealtimeNotifications();

  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    // Combine les notifications des métriques statiques et des mises à jour en temps réel
    const realtimeCount = totalNotificationCount || 0;
    console.log("Unread count calculation:", { 
      staticUnreadMessages, 
      realtimeCount,
      totalNotificationCount,
      realtimeMessages: unreadMessages 
    });
    
    setTotalUnreadCount(
      Math.max(staticUnreadMessages, realtimeCount)
    );
  }, [staticUnreadMessages, totalNotificationCount, unreadMessages]);

  useEffect(() => {
    console.log("DashboardMetrics data received:", {
      propertiesCount: propertiesData?.length || 0,
      maintenanceCount: maintenanceData?.length || 0,
      tenantsCount: tenantsData?.length || 0,
      hasMetrics: !!metrics,
      unreadMessages: totalUnreadCount,
      realtimeUnreadMessages: unreadMessages,
      dateRange
    });

    return () => {
      console.log("DashboardMetrics unmounting");
    };
  }, [propertiesData, maintenanceData, tenantsData, metrics, totalUnreadCount, unreadMessages, dateRange]);

  return (
    <div className="relative">
      <NotificationBell 
        unreadCount={totalUnreadCount} 
        unreadMessages={unreadMessages} 
        maintenanceRequests={maintenanceRequests}
        onShowAllNotifications={() => setShowUnreadDialog(true)}
      />
      <MetricsGrid metrics={metrics} unreadMessages={totalUnreadCount} />
      
      <UnreadMessagesDialog 
        open={showUnreadDialog} 
        onOpenChange={setShowUnreadDialog} 
        unreadMessages={unreadMessages || []} 
      />
    </div>
  );
};
