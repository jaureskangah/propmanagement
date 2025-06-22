
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { SimplifiedDashboardHeader } from "@/components/dashboard/SimplifiedDashboardHeader";
import { SimplifiedDashboardContainer } from "@/components/dashboard/SimplifiedDashboardContainer";
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from "@/components/providers/LocaleProvider";
import { DateRange } from "@/components/dashboard/DashboardDateFilter";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSidebar } from "@/components/sidebar/ModernSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardContent = () => {
  const { t } = useLocale();
  const { open } = useSidebar();
  const isMobile = useIsMobile();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date()
  });

  // Fetch all required data
  const { data: propertiesData = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: maintenanceData = [] } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase.from('maintenance_requests').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: tenantsData = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenants').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: paymentsData = [] } = useQuery({
    queryKey: ['tenant_payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenant_payments').select('*');
      if (error) throw error;
      return data;
    }
  });

  const handleDateRangeChange = (newDateRange: DateRange) => {
    console.log("Dashboard page received date range:", newDateRange);
    setDateRange(newDateRange);
  };

  return (
    <div className={cn(
      "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
      !isMobile && (open ? "md:ml-[270px]" : "md:ml-[80px]")
    )}>
      <SimplifiedDashboardHeader 
        title={t('dashboard')}
        onDateRangeChange={handleDateRangeChange}
      />
      <SimplifiedDashboardContainer 
        dateRange={dateRange}
        propertiesData={propertiesData}
        maintenanceData={maintenanceData}
        tenantsData={tenantsData}
        paymentsData={paymentsData}
      />
    </div>
  );
};

const Dashboard = () => {
  const { isAuthenticated, loading, isTenant } = useAuth();

  useEffect(() => {
    console.log("=== OWNER DASHBOARD ===");
    console.log("Dashboard component mounted, auth state:", { 
      isAuthenticated, 
      isTenant,
      loading 
    });
  }, [isAuthenticated, isTenant, loading]);

  // Show loading spinner while checking auth OR while tenant status is being determined
  if (loading) {
    console.log("Dashboard showing loading spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  // Redirect tenants to their dashboard - SEULEMENT si on est sûr du statut
  if (isTenant && !loading) {
    console.log("🔄 User is tenant, redirecting to tenant dashboard");
    return <Navigate to="/tenant/dashboard" replace />;
  }

  // Only property owners should reach this point
  console.log("✅ Rendering owner dashboard for property owner");
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
