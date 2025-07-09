import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from "@/components/providers/LocaleProvider";
import { ReportsContainer } from "@/components/reports/ReportsContainer";

const Reports = () => {
  const { isAuthenticated, loading, isTenant } = useAuth();
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (isTenant && !loading) {
    return <Navigate to="/tenant/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-20 p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('advancedReports', { fallback: 'Rapports Avancés' })}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('analyticsDescription', { fallback: 'Tableaux de bord analytics et métriques de performance' })}
            </p>
          </div>
          <ReportsContainer />
        </div>
      </div>
    </div>
  );
};

export default Reports;