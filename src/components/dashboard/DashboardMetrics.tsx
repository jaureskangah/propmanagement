import { DashboardMetric } from "@/components/DashboardMetric";
import { Building2, Users, Wrench, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DateRange } from "./DashboardDateFilter";
import { isWithinInterval } from "date-fns";

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
      />
    </div>
  );
};