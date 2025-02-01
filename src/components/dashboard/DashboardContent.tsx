import { RevenueChart } from "./RevenueChart";
import { RecentActivity } from "./RecentActivity";
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardDateFilter, type DateRange } from "./DashboardDateFilter";

interface DashboardContentProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  propertiesData: any[];
  maintenanceData: any[];
  tenantsData: any[];
}

export const DashboardContent = ({
  dateRange,
  onDateRangeChange,
  propertiesData,
  maintenanceData,
  tenantsData,
}: DashboardContentProps) => {
  return (
    <div className="space-y-6">
      <DashboardDateFilter onDateRangeChange={onDateRangeChange} />
      
      <DashboardMetrics 
        propertiesData={propertiesData}
        maintenanceData={maintenanceData}
        tenantsData={tenantsData}
        dateRange={dateRange}
      />

      <RevenueChart />
      
      <RecentActivity />
    </div>
  );
};