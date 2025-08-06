import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewMetrics } from "./components/OverviewMetrics";
import { RevenueChart } from "./components/RevenueChart";
import { MaintenanceAnalytics } from "./components/MaintenanceAnalytics";
import { OccupancyTrends } from "./components/OccupancyTrends";

import { GlobalExportOptions } from "../shared/GlobalExportOptions";

export const AnalyticsDashboard = () => {
  const { t } = useLocale();

  // Fetch all data needed for analytics
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenants').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ['tenant_payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenant_payments').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: maintenance = [], isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase.from('maintenance_requests').select('*');
      if (error) throw error;
      return data;
    }
  });

  const isLoading = isLoadingProperties || isLoadingTenants || isLoadingPayments || isLoadingMaintenance;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const allData = {
    properties,
    tenants,
    payments,
    maintenance
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with export options - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('analyticsOverview', { fallback: 'Vue d\'ensemble Analytics' })}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('comprehensiveAnalytics', { fallback: 'Analyse complète de vos données immobilières' })}
          </p>
        </div>
        <div className="flex-shrink-0">
          <GlobalExportOptions data={allData} type="analytics" />
        </div>
      </div>

      {/* Overview Metrics - Enhanced animations */}
      <div className="animate-slide-up-fade">
        <OverviewMetrics 
          properties={properties}
          tenants={tenants}
          payments={payments}
          maintenance={maintenance}
        />
      </div>

      {/* Charts Grid - Staggered animations on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <RevenueChart payments={payments} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <MaintenanceAnalytics maintenance={maintenance} />
        </div>
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <OccupancyTrends tenants={tenants} properties={properties} />
        </div>
      </div>
    </div>
  );
};