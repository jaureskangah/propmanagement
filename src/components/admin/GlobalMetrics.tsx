import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { 
  Loader2, 
  Users, 
  Building2, 
  DollarSign, 
  Activity,
  TrendingUp,
  UserCheck,
  Home,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const GlobalMetrics = () => {
  const { t } = useLocale();

  // Fetch global metrics
  const { data: metrics = [], isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['admin_global_metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_metrics')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch current stats
  const { data: currentStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin_current_stats'],
    queryFn: async () => {
      const [users, properties, tenants, payments, maintenance] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('tenants').select('*', { count: 'exact', head: true }),
        supabase.from('tenant_payments').select('amount'),
        supabase.from('maintenance_requests').select('status')
      ]);

      const totalRevenue = payments.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      const pendingMaintenance = maintenance.data?.filter(req => req.status === 'pending')?.length || 0;

      return {
        totalUsers: users.count || 0,
        totalProperties: properties.count || 0,
        totalTenants: tenants.count || 0,
        totalRevenue,
        pendingMaintenance,
        occupancyRate: properties.count ? Math.round((tenants.count || 0) / properties.count * 100) : 0
      };
    }
  });

  const isLoading = isLoadingMetrics || isLoadingStats;
  const latestMetrics = metrics[0] || {};

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const metricsCards = [
    {
      title: t('totalUsers', { fallback: 'Utilisateurs Totaux' }),
      value: currentStats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      trend: latestMetrics.total_users ? `+${((currentStats?.totalUsers || 0) - latestMetrics.total_users)}` : null
    },
    {
      title: t('totalProperties', { fallback: 'Propriétés Totales' }),
      value: currentStats?.totalProperties || 0,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      trend: latestMetrics.total_properties ? `+${((currentStats?.totalProperties || 0) - latestMetrics.total_properties)}` : null
    },
    {
      title: t('totalTenants', { fallback: 'Locataires Totaux' }),
      value: currentStats?.totalTenants || 0,
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      trend: latestMetrics.total_tenants ? `+${((currentStats?.totalTenants || 0) - latestMetrics.total_tenants)}` : null
    },
    {
      title: t('totalRevenue', { fallback: 'Revenus Totaux' }),
      value: `€${(currentStats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      trend: latestMetrics.total_revenue ? `+€${((currentStats?.totalRevenue || 0) - latestMetrics.total_revenue).toLocaleString()}` : null
    },
    {
      title: t('occupancyRate', { fallback: 'Taux d\'Occupation' }),
      value: `${currentStats?.occupancyRate || 0}%`,
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: t('pendingMaintenance', { fallback: 'Maintenance en Attente' }),
      value: currentStats?.pendingMaintenance || 0,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    }
  ];

  // Prepare chart data
  const chartData = metrics.slice(0, 10).reverse().map(metric => ({
    date: new Date(metric.metric_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    users: metric.total_users,
    properties: metric.total_properties,
    revenue: metric.total_revenue / 1000 // Convert to thousands for better chart display
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('globalMetrics', { fallback: 'Métriques Globales' })}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('systemOverview', { fallback: 'Vue d\'ensemble du système et statistiques globales' })}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {metricsCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={index} 
              className="group hover-lift glass-card cursor-pointer transition-all duration-300 border-border/50 hover:border-primary/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className={`p-2 sm:p-3 rounded-full ${metric.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.color} transition-colors duration-300`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      {metric.title}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold transition-colors duration-300 group-hover:text-primary">
                      {metric.value}
                    </p>
                    {metric.trend && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {metric.trend}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('growthTrend', { fallback: 'Tendance de Croissance' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Utilisateurs"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="properties" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Propriétés"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('revenueEvolution', { fallback: 'Évolution des Revenus' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${Number(value) * 1000}`, 'Revenus']} />
                  <Bar dataKey="revenue" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};