import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2, TrendingUp, TrendingDown, Activity, Target, Clock, CheckCircle } from "lucide-react";
import { GlobalExportOptions } from "../shared/GlobalExportOptions";

export const PerformanceMetrics = () => {
  const { t } = useLocale();

  // Fetch all performance-related data
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

  const { data: communications = [], isLoading: isLoadingCommunications } = useQuery({
    queryKey: ['tenant_communications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenant_communications').select('*');
      if (error) throw error;
      return data;
    }
  });

  const isLoading = isLoadingProperties || isLoadingTenants || isLoadingPayments || isLoadingMaintenance || isLoadingCommunications;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const performanceData = {
    properties,
    tenants,
    payments,
    maintenance,
    communications
  };

  // Calculate performance metrics
  const totalUnits = properties.reduce((sum, property) => sum + (property.units || 0), 0);
  const occupiedUnits = tenants.length;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  // Payment performance
  const onTimePayments = payments.filter(payment => payment.status === 'paid').length;
  const latePayments = payments.filter(payment => payment.status === 'overdue').length;
  const paymentRate = payments.length > 0 ? (onTimePayments / payments.length) * 100 : 0;

  // Maintenance performance
  const completedMaintenance = maintenance.filter(item => 
    item.status === 'completed' || item.status === 'Completed' || item.status === 'Resolved'
  ).length;
  const pendingMaintenance = maintenance.filter(item => 
    item.status === 'pending' || item.status === 'Pending'
  ).length;
  const maintenanceEfficiency = maintenance.length > 0 ? (completedMaintenance / maintenance.length) * 100 : 0;

  // Communication response rate
  const resolvedCommunications = communications.filter(comm => 
    comm.status === 'resolved' || comm.status === 'read'
  ).length;
  const responseRate = communications.length > 0 ? (resolvedCommunications / communications.length) * 100 : 0;

  // Revenue performance - only count paid payments for total revenue
  const paidPayments = payments.filter(payment => payment.status === 'paid');
  const totalRevenue = paidPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const averageRent = tenants.length > 0 ? tenants.reduce((sum, tenant) => sum + (tenant.rent_amount || 0), 0) / tenants.length : 0;

  const kpiMetrics = [
    {
      title: t('occupancyRate', { fallback: 'Taux d\'Occupation' }),
      value: `${occupancyRate.toFixed(0)}%`,
      target: 90,
      actual: occupancyRate,
      icon: Target,
      color: occupancyRate >= 90 ? 'text-green-600' : occupancyRate >= 70 ? 'text-yellow-600' : 'text-red-600',
      bgColor: occupancyRate >= 90 ? 'bg-green-50' : occupancyRate >= 70 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: t('paymentRate', { fallback: 'Taux de Paiement' }),
      value: `${paymentRate.toFixed(0)}%`,
      target: 95,
      actual: paymentRate,
      icon: CheckCircle,
      color: paymentRate >= 95 ? 'text-green-600' : paymentRate >= 80 ? 'text-yellow-600' : 'text-red-600',
      bgColor: paymentRate >= 95 ? 'bg-green-50' : paymentRate >= 80 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: t('maintenanceEfficiency', { fallback: 'Efficacité Maintenance' }),
      value: `${maintenanceEfficiency.toFixed(0)}%`,
      target: 85,
      actual: maintenanceEfficiency,
      icon: Activity,
      color: maintenanceEfficiency >= 85 ? 'text-green-600' : maintenanceEfficiency >= 70 ? 'text-yellow-600' : 'text-red-600',
      bgColor: maintenanceEfficiency >= 85 ? 'bg-green-50' : maintenanceEfficiency >= 70 ? 'bg-yellow-50' : 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with export options */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('performanceMetrics', { fallback: 'Métriques de Performance' })}
          </h2>
          <p className="text-muted-foreground">
            {t('keyPerformanceIndicators', { fallback: 'Indicateurs clés de performance' })}
          </p>
        </div>
        <GlobalExportOptions data={performanceData} type="performance" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const performance = (metric.actual / metric.target) * 100;
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  {performance >= 100 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </p>
                  
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t('target', { fallback: 'Objectif' })}: {metric.target}%</span>
                      <span>{performance.toFixed(0)}% {t('ofTarget', { fallback: 'de l\'objectif' })}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          performance >= 100 ? 'bg-green-500' :
                          performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(performance, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('occupancyBreakdown', { fallback: 'Répartition de l\'Occupation' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('totalUnits', { fallback: 'Unités totales' })}</span>
                <span className="font-medium">{totalUnits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('occupiedUnits', { fallback: 'Unités occupées' })}</span>
                <span className="font-medium text-green-600">{occupiedUnits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('vacantUnits', { fallback: 'Unités vacantes' })}</span>
                <span className="font-medium text-red-600">{totalUnits - occupiedUnits}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>{t('occupancyRate', { fallback: 'Taux d\'occupation' })}</span>
                  <span className={occupancyRate >= 90 ? 'text-green-600' : 'text-yellow-600'}>
                    {occupancyRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('financialPerformance', { fallback: 'Performance Financière' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('totalRevenue', { fallback: 'Revenus totaux' })}</span>
                <span className="font-medium">${totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('averageRent', { fallback: 'Loyer moyen' })}</span>
                <span className="font-medium">${averageRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('onTimePayments', { fallback: 'Paiements à temps' })}</span>
                <span className="font-medium text-green-600">{onTimePayments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('latePayments', { fallback: 'Paiements en retard' })}</span>
                <span className="font-medium text-red-600">{latePayments}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>{t('paymentRate', { fallback: 'Taux de paiement' })}</span>
                  <span className={paymentRate >= 95 ? 'text-green-600' : 'text-yellow-600'}>
                    {paymentRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};