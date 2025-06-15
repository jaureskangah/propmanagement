
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from "@/components/providers/LocaleProvider";
import { DateRange } from "@/components/dashboard/DashboardDateFilter";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import AnimatedLayout from "@/components/layout/AnimatedLayout";
import { useState } from 'react';

const Dashboard = () => {
  const { isAuthenticated, loading, isTenant } = useAuth();
  const { t } = useLocale();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleDateRangeChange = (newDateRange: DateRange) => {
    console.log("Dashboard page received date range:", newDateRange);
    setDateRange(newDateRange);
  };

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
    <AnimatedLayout isTenant={false}>
      <DashboardHeader 
        title={t('dashboard')}
        onDateRangeChange={handleDateRangeChange}
      />
      <DashboardContent isLoading={false} metrics={{}} dateRange={dateRange} />
    </AnimatedLayout>
  );
};

export default Dashboard;
