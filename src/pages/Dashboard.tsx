
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from "@/components/providers/LocaleProvider";
import { DateRange } from "@/components/dashboard/DashboardDateFilter";

const Dashboard = () => {
  const { isAuthenticated, loading, user } = useAuth();
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
    console.log("Dashboard component mounted, auth state:", { 
      isAuthenticated, 
      isTenant: user?.user_metadata?.is_tenant_user,
      userName: user?.user_metadata?.first_name,
      loading 
    });
  }, [isAuthenticated, user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  // Vérifier si l'utilisateur est un locataire
  if (user?.user_metadata?.is_tenant_user) {
    console.log("User is tenant, redirecting to tenant dashboard");
    return <Navigate to="/tenant/dashboard" replace />;
  }

  console.log("Rendering owner dashboard");
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="p-6 md:p-8 pt-24 md:pt-8 md:ml-[270px]">
        <DashboardHeader 
          title={t('dashboard')} // Use translation for title
          onDateRangeChange={handleDateRangeChange}
        />
        <DashboardContent isLoading={false} metrics={{}} dateRange={dateRange} />
      </div>
    </div>
  );
};

export default Dashboard;
