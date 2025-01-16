import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";
import { DashboardDateFilter, DateRange } from "@/components/dashboard/DashboardDateFilter";
import { useState, useEffect } from "react";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";

const Dashboard = () => {
  console.log("Rendering Dashboard");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  // Query to check if user is a tenant
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Redirect tenant users to maintenance page
  useEffect(() => {
    if (profileData?.is_tenant_user) {
      navigate("/maintenance");
    }
  }, [profileData, navigate]);

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
    enabled: !!user && !profileData?.is_tenant_user,
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
    enabled: !!user && !profileData?.is_tenant_user,
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
    enabled: !!user && !profileData?.is_tenant_user,
  });

  if (isLoadingProfile || isLoadingProperties || isLoadingMaintenance || isLoadingTenants) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is a tenant, they shouldn't see this page
  if (profileData?.is_tenant_user) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 space-y-6 p-8 font-sans">
        <DashboardHeader />
        
        <DashboardDateFilter onDateRangeChange={setDateRange} />

        <DashboardMetrics 
          propertiesData={propertiesData || []}
          maintenanceData={maintenanceData || []}
          tenantsData={tenantsData || []}
          dateRange={dateRange}
        />

        <RevenueChart />

        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;