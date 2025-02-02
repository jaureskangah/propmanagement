import { DashboardMetric } from "@/components/DashboardMetric";
import { Building2, Users, Wrench, DollarSign, ArrowUpRight, ArrowDownRight, Percent } from "lucide-react";
import { DateRange } from "./DashboardDateFilter";
import { isWithinInterval, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const occupiedUnits = totalTenants;
  const globalOccupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Calculate occupancy trend
  const previousMonthTenants = filteredTenantsData.filter(tenant => 
    isWithinInterval(new Date(tenant.created_at), {
      start: subMonths(dateRange.startDate, 1),
      end: subMonths(dateRange.endDate, 1)
    })
  ).length || 0;

  const occupancyTrend = previousMonthTenants > 0 
    ? Math.round(((occupiedUnits - previousMonthTenants) / previousMonthTenants) * 100)
    : 0;

  // Generate occupancy chart data
  const occupancyChartData = generateMonthlyData(filteredTenantsData).map((m, i, arr) => {
    const monthUnits = propertiesData.reduce((acc, property) => {
      const propertyDate = new Date(property.created_at);
      if (propertyDate.getMonth() <= m.month && propertyDate.getFullYear() <= m.year) {
        return acc + (property.units || 0);
      }
      return acc;
    }, 0);
    
    return {
      value: monthUnits > 0 ? Math.round((m.value / monthUnits) * 100) : 0
    };
  });

  // Ajout du calcul des messages non lus
  const unreadMessages = filteredTenantsData.reduce((acc, tenant) => {
    const unreadCount = tenant.tenant_communications?.filter(
      (comm: any) => comm.status === 'unread' && comm.is_from_tenant
    ).length || 0;
    return acc + unreadCount;
  }, 0);

  return (
    <div className="relative">
      {/* Bulle de notification */}
      {unreadMessages > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -top-12 right-0 h-12 w-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300",
            "border border-purple-100 hover:border-purple-200"
          )}
        >
          <Bell className="h-5 w-5 text-purple-600" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-600 text-[11px] text-white flex items-center justify-center">
            {unreadMessages}
          </span>
        </Button>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <DashboardMetric
          title="Global Occupancy"
          value={`${globalOccupancyRate}%`}
          icon={<Percent className="h-4 w-4 text-violet-600" />}
          description={
            <div className={cn(
              "flex items-center gap-1",
              occupancyTrend >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {occupancyTrend >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span>{Math.abs(occupancyTrend)}% from last month</span>
            </div>
          }
          chartData={occupancyChartData}
          chartColor="#7C3AED"
        />

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
        />
      </div>
    </div>
  );
};
