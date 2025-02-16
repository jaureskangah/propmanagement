
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import type { DateRange } from "@/components/dashboard/DashboardDateFilter";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate, mounted]);

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
    enabled: !!user && mounted,
  });

  const { data: currentMonthRevenue } = useQuery({
    queryKey: ["revenue", "current", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenant_payments")
        .select("amount")
        .gte("payment_date", dateRange.startDate.toISOString())
        .lte("payment_date", dateRange.endDate.toISOString());
      
      if (error) throw error;
      return data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    },
    enabled: !!user && mounted && !profileData?.is_tenant_user,
  });

  const { data: previousMonthRevenue } = useQuery({
    queryKey: ["revenue", "previous", dateRange],
    queryFn: async () => {
      const previousStart = new Date(dateRange.startDate);
      previousStart.setMonth(previousStart.getMonth() - 1);
      const previousEnd = new Date(dateRange.endDate);
      previousEnd.setMonth(previousEnd.getMonth() - 1);

      const { data, error } = await supabase
        .from("tenant_payments")
        .select("amount")
        .gte("payment_date", previousStart.toISOString())
        .lte("payment_date", previousEnd.toISOString());
      
      if (error) throw error;
      return data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    },
    enabled: !!user && mounted && !profileData?.is_tenant_user,
  });

  const calculateTrend = () => {
    if (!previousMonthRevenue || previousMonthRevenue === 0) return 0;
    const difference = (currentMonthRevenue || 0) - previousMonthRevenue;
    return Math.round((difference / previousMonthRevenue) * 100);
  };

  const { data: propertiesData, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties", user?.id, dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*, tenants(*)");
      if (error) throw error;
      return data;
    },
    enabled: !!user && mounted && !profileData?.is_tenant_user,
  });

  const { data: maintenanceData, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["maintenance_requests", user?.id, dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*");
      if (error) throw error;
      return data;
    },
    enabled: !!user && mounted && !profileData?.is_tenant_user,
  });

  const { data: tenantsData, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["tenants", user?.id, dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select(`
          *,
          properties (
            name
          ),
          tenant_documents (*),
          tenant_payments (*),
          maintenance_requests (
            id,
            issue,
            status,
            created_at
          ),
          tenant_communications (
            id,
            type,
            subject,
            created_at,
            status,
            is_from_tenant
          )
        `);
      if (error) throw error;
      return data;
    },
    enabled: !!user && mounted && !profileData?.is_tenant_user,
  });

  useEffect(() => {
    if (mounted && profileData?.is_tenant_user) {
      navigate("/maintenance", { replace: true });
    }
  }, [profileData, navigate, mounted]);

  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 space-y-6 p-8 font-sans">
        <DashboardHeader 
          title="Dashboard" 
          trend={{
            value: calculateTrend(),
            label: "vs last month"
          }}
        />
        
        <DashboardContent
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          propertiesData={propertiesData || []}
          maintenanceData={maintenanceData || []}
          tenantsData={tenantsData || []}
        />
      </div>
    </div>
  );
};

export default Dashboard;
