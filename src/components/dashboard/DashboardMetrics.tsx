import { DashboardMetric } from "@/components/DashboardMetric";
import { Building2, Users, Wrench, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DateRange } from "./DashboardDateFilter";
import { isWithinInterval, subMonths } from "date-fns";

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
  // Filter data based on date range
  const filteredMaintenanceData = maintenanceData?.filter(req => 
    isWithinInterval(new Date(req.created_at), {
      start: dateRange.startDate,
      end: dateRange.endDate
    })
  ) || [];

  const filteredTenantsData = tenantsData?.filter(tenant =>
    isWithinInterval(new Date(tenant.created_at), {
      start: dateRange.startDate,
      end: dateRange.endDate
    })
  ) || [];

  // Generate chart data for the last 6 months
  const generateMonthlyData = (data: any[], valueKey: string = 'amount') => {
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

  const totalProperties = propertiesData?.length || 0;
  const totalTenants = filteredTenantsData.length;
  const pendingMaintenance = filteredMaintenanceData.filter(req => req.status === "Pending").length;
  const totalMonthlyRevenue = filteredTenantsData.reduce((acc, tenant) => acc + (tenant.rent_amount || 0), 0);

  // Calculate occupancy rate
  const totalUnits = propertiesData?.reduce((acc, property) => acc + (property.units || 0), 0) || 0;
  const occupancyRate = totalUnits > 0 ? Math.round((totalTenants / totalUnits) * 100) : 0;

  // Get new properties this month
  const newPropertiesThisMonth = propertiesData?.filter(property => 
    isWithinInterval(new Date(property.created_at), {
      start: dateRange.startDate,
      end: dateRange.endDate
    })
  ).length || 0;

  // Generate chart data
  const revenueChartData = generateMonthlyData(tenantsData, 'rent_amount');
  const maintenanceChartData = generateMonthlyData(maintenanceData);
  const tenantsChartData = generateMonthlyData(tenantsData).map(m => ({ value: m.value || 0 }));
  const propertiesChartData = generateMonthlyData(propertiesData).map(m => ({ value: m.value || 1 }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardMetric
        title="Properties"
        value={totalProperties.toString()}
        icon={<Building2 className="h-4 w-4 text-blue-600" />}
        description={
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>{newPropertiesThisMonth} new this month</span>
          </div>
        }
        chartData={propertiesChartData}
        chartColor="#1E40AF"
        tooltip="Total number of properties in your portfolio. The chart shows the growth trend over the last 6 months."
      />
      <DashboardMetric
        title="Tenants"
        value={totalTenants.toString()}
        icon={<Users className="h-4 w-4 text-indigo-600" />}
        description={
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>{occupancyRate}% occupancy rate</span>
          </div>
        }
        chartData={tenantsChartData}
        chartColor="#4F46E5"
        tooltip="Total number of active tenants. The occupancy rate shows the percentage of occupied units across all properties."
      />
      <DashboardMetric
        title="Maintenance"
        value={pendingMaintenance.toString()}
        icon={<Wrench className="h-4 w-4 text-amber-600" />}
        description={
          <div className="flex items-center gap-1 text-red-600">
            <ArrowDownRight className="h-3 w-3" />
            <span>{pendingMaintenance} pending requests</span>
          </div>
        }
        chartData={maintenanceChartData}
        chartColor="#D97706"
        tooltip="Number of pending maintenance requests that require attention. The chart shows the maintenance request trend over time."
      />
      <DashboardMetric
        title="Monthly Revenue"
        value={`$${totalMonthlyRevenue.toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
        description={
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>Based on current leases</span>
          </div>
        }
        chartData={revenueChartData}
        chartColor="#059669"
        tooltip="Total monthly revenue based on current active leases. The chart shows revenue trends over the last 6 months."
      />
    </div>
  );
};