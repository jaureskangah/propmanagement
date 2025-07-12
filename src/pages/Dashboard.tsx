import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import AppSidebar from '@/components/AppSidebar';
import { SimplifiedDashboardContainer } from '@/components/dashboard/SimplifiedDashboardContainer';
import { SimplifiedDashboardHeader } from '@/components/dashboard/SimplifiedDashboardHeader';
import { DateRange } from '@/components/dashboard/DashboardDateFilter';
import { useLocale } from '@/components/providers/LocaleProvider';

const Dashboard = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { t } = useLocale();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground animate-pulse">
            {t('loading', { fallback: 'Chargement...' })}
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user profile indicates tenant user
  // For now, assume non-tenant users access this dashboard

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-0 md:ml-20 p-4 sm:p-6">
        <SimplifiedDashboardHeader 
          title={t('dashboard', { fallback: 'Dashboard' })}
          onDateRangeChange={setDateRange}
        />
        <SimplifiedDashboardContainer 
          dateRange={dateRange}
          propertiesData={[]}
          maintenanceData={[]}
          tenantsData={[]}
          paymentsData={[]}
        />
      </div>
    </div>
  );
};

export default Dashboard;