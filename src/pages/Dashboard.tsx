import { DashboardMetric } from "@/components/DashboardMetric";
import { Building2, Users, Wrench, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  console.log("Rendering Dashboard");
  const { user } = useAuth();

  const { data: propertiesData, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*, tenants(*)");
      if (error) throw error;
      console.log("Properties data:", data);
      return data;
    },
    enabled: !!user,
  });

  const { data: maintenanceData, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["maintenance_requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*");
      if (error) throw error;
      console.log("Maintenance data:", data);
      return data;
    },
    enabled: !!user,
  });

  const { data: tenantsData, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["tenants", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*");
      if (error) throw error;
      console.log("Tenants data:", data);
      return data;
    },
    enabled: !!user,
  });

  if (isLoadingProperties || isLoadingMaintenance || isLoadingTenants) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalProperties = propertiesData?.length || 0;
  const totalTenants = tenantsData?.length || 0;
  const pendingMaintenance = maintenanceData?.filter(req => req.status === "Pending").length || 0;
  const totalMonthlyRevenue = tenantsData?.reduce((acc, tenant) => acc + (tenant.rent_amount || 0), 0) || 0;

  // Calculate occupancy rate
  const totalUnits = propertiesData?.reduce((acc, property) => acc + (property.units || 0), 0) || 0;
  const occupancyRate = totalUnits > 0 ? Math.round((totalTenants / totalUnits) * 100) : 0;

  // Get new properties this month
  const currentMonth = new Date().getMonth();
  const newPropertiesThisMonth = propertiesData?.filter(property => {
    const propertyMonth = new Date(property.created_at).getMonth();
    return propertyMonth === currentMonth;
  }).length || 0;

  return (
    <div className="space-y-6 p-8 font-sans">
      <DashboardHeader />

      {/* Metrics Grid */}
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

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;