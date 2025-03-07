
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
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <DashboardHeader 
            title={t('dashboard.properties') || "Tableau de bord"} 
            onDateRangeChange={handleDateRangeChange}
          />
          <DashboardContent isLoading={false} metrics={{}} dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
