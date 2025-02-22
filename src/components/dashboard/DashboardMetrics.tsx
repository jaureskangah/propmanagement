
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
      propertiesCount: propertiesData?.length,
      maintenanceCount: maintenanceData?.length,
      tenantsCount: tenantsData?.length,
      hasMetrics: !!metrics,
      unreadMessages
    });

    return () => {
      console.log("DashboardMetrics unmounting");
    };
  }, [propertiesData, maintenanceData, tenantsData, metrics, unreadMessages]);

  return (
    <div className="relative">
      <NotificationBell unreadCount={unreadMessages} />
      <MetricsGrid metrics={metrics} unreadMessages={unreadMessages} />
    </div>
  );
};
