
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
  const { metrics, unreadMessages } = useMetricsData(
    propertiesData,
    maintenanceData,
    tenantsData,
    dateRange
  );
  
  const { 
    unreadMessages: realtimeUnreadMessages, 
    showUnreadDialog, 
    setShowUnreadDialog 
  } = useRealtimeNotifications();

  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    // Combine count from metrics and realtime updates
    const realtimeCount = realtimeUnreadMessages?.length || 0;
    console.log("Unread count calculation:", { 
      unreadMessages, 
      realtimeCount,
      realtimeMessages: realtimeUnreadMessages 
    });
    
    setTotalUnreadCount(
      unreadMessages + realtimeCount
    );
  }, [unreadMessages, realtimeUnreadMessages]);

  useEffect(() => {
    console.log("DashboardMetrics data received:", {
      propertiesCount: propertiesData?.length || 0,
      maintenanceCount: maintenanceData?.length || 0,
      tenantsCount: tenantsData?.length || 0,
      hasMetrics: !!metrics,
      unreadMessages: totalUnreadCount,
      realtimeUnreadMessages,
      dateRange
    });

    return () => {
      console.log("DashboardMetrics unmounting");
    };
  }, [propertiesData, maintenanceData, tenantsData, metrics, totalUnreadCount, realtimeUnreadMessages, dateRange]);

  return (
    <div className="relative">
      <NotificationBell unreadCount={totalUnreadCount} />
      <MetricsGrid metrics={metrics} unreadMessages={totalUnreadCount} />
      
      <UnreadMessagesDialog 
        open={showUnreadDialog} 
        onOpenChange={setShowUnreadDialog} 
        unreadMessages={realtimeUnreadMessages || []} 
      />
    </div>
  );
};
