import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";
import { DashboardDateFilter, DateRange } from "@/components/dashboard/DashboardDateFilter";
import { useState } from "react";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";

const Dashboard = () => {
  console.log("Rendering Dashboard");
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  const { data: propertiesData, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties", user?.id, dateRange],
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
    queryKey: ["maintenance_requests", user?.id, dateRange],
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
    queryKey: ["tenants", user?.id, dateRange],
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

  return (
    <div className="space-y-6 p-8 font-sans">
      <DashboardHeader />
      
      <DashboardDateFilter onDateRangeChange={setDateRange} />

      <DashboardMetrics 
        propertiesData={propertiesData || []}
        maintenanceData={maintenanceData || []}
        tenantsData={tenantsData || []}
        dateRange={dateRange}
      />

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;