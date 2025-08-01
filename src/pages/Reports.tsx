
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

import { useAuth } from '@/components/AuthProvider';
import { useLocale } from "@/components/providers/LocaleProvider";
import { ReportsContainer } from "@/components/reports/ReportsContainer";
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

const Reports = () => {
  const { isAuthenticated, loading, isTenant } = useAuth();
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground animate-pulse">
            {t('loadingReports', { fallback: 'Loading reports...' })}
          </p>
        </div>
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
    <ResponsiveLayout title={t('advancedReports', { fallback: 'Advanced Reports' })}>
      <div className="max-w-7xl mx-auto p-3 sm:p-6 md:p-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover-scale transition-transform duration-200">
                {t('advancedReports', { fallback: 'Advanced Reports' })}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {t('analyticsDescription', { fallback: 'Analytics dashboards and performance metrics' })}
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full animate-scale-in">
              <BarChart3 className="w-3 h-3" />
              <span>{t('analyticsMode', { fallback: 'Analytics' })}</span>
            </div>
          </div>
        </div>
        <div className="animate-slide-in-right">
          <ReportsContainer />
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Reports;
