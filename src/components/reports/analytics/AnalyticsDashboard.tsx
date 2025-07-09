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
    queryKey: ['analytics_properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ['analytics_tenants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenants').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ['analytics_payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenant_payments').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: maintenance = [], isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['analytics_maintenance'],
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
    <div className="space-y-6">
      {/* Header with export options */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('analyticsOverview', { fallback: 'Vue d\'ensemble Analytics' })}
          </h2>
          <p className="text-muted-foreground">
            {t('comprehensiveAnalytics', { fallback: 'Analyse complète de vos données immobilières' })}
          </p>
        </div>
        <GlobalExportOptions data={allData} type="analytics" />
      </div>

      {/* Overview Metrics */}
      <OverviewMetrics 
        properties={properties}
        tenants={tenants}
        payments={payments}
        maintenance={maintenance}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart payments={payments} />
        <MaintenanceAnalytics maintenance={maintenance} />
        <OccupancyTrends tenants={tenants} properties={properties} />
      </div>
    </div>
  );
};