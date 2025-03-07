
import { NotificationBell } from "./NotificationBell";
import { useMetricsData } from "./hooks/useMetricsData";
import { MetricsGrid } from "./metrics/MetricsGrid";
import type { DateRange } from "./DashboardDateFilter";
import { useEffect } from "react";

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

  useEffect(() => {
    console.log("DashboardMetrics data received:", {
      propertiesCount: propertiesData?.length || 0,
      maintenanceCount: maintenanceData?.length || 0,
      tenantsCount: tenantsData?.length || 0,
      hasMetrics: !!metrics,
      unreadMessages,
      dateRange
    });

    return () => {
      console.log("DashboardMetrics unmounting");
    };
  }, [propertiesData, maintenanceData, tenantsData, metrics, unreadMessages, dateRange]);

  return (
    <div className="relative">
      <NotificationBell unreadCount={unreadMessages} />
      <MetricsGrid metrics={metrics} unreadMessages={unreadMessages} />
    </div>
  );
};
