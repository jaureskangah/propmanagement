
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import AppSidebar from "@/components/AppSidebar";
import { MetricsGrid } from "@/components/admin/MetricsGrid";
import { GrowthChart } from "@/components/admin/GrowthChart";
import { AdminHeader } from "@/components/admin/AdminHeader";

interface AdminMetrics {
  total_users: number;
  active_users: number;
  total_revenue: number;
  total_properties: number;
  total_tenants: number;
  metric_date: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t, language } = useLocale();
  const dateLocale = language === 'fr' ? fr : undefined;

  useEffect(() => {
    fetchMetrics();
  }, [language]); // Refetch when language changes

  const fetchMetrics = async () => {
    try {
      console.log("Fetching admin metrics...");
      const { data, error } = await supabase
        .from('admin_metrics')
        .select('*')
        .order('metric_date', { ascending: true });

      if (error) throw error;

      const formattedData = data?.map(metric => ({
        ...metric,
        metric_date: format(new Date(metric.metric_date), 'd MMM', { locale: dateLocale }),
        total_revenue: Number(metric.total_revenue)
      })) || [];

      console.log("Fetched metrics:", formattedData);
      setMetrics(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const headers = [
        "Date",
        t('totalUsers'),
        t('activeUsers'),
        t('totalRevenue'),
        t('properties'),
        t('totalTenants')
      ];
      const csvData = [
        headers.join(","),
        ...metrics.map(metric => [
          metric.metric_date,
          metric.total_users,
          metric.active_users,
          metric.total_revenue,
          metric.total_properties,
          metric.total_tenants
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admin_metrics_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: t('downloadSuccess'),
        description: t('downloadSuccess'),
      });
    } catch (err) {
      console.error('Error downloading data:', err);
      toast({
        title: t('error'),
        description: t('downloadError'),
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      
      if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
        await navigator.share({
          title: t('adminDashboard'),
          text: t('adminDashboard'),
          url: shareUrl
        });
        
        toast({
          title: t('shareSuccess'),
          description: t('shareSuccess'),
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: t('copySuccess'),
          description: t('copySuccess'),
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast({
        title: t('error'),
        description: t('shareError'),
        variant: "destructive",
      });
    }
  };

  const latestMetrics = metrics[metrics.length - 1] || {
    total_users: 0,
    active_users: 0,
    total_revenue: 0,
    total_properties: 0,
    total_tenants: 0
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">{t('loading')}</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:px-6">
          <AdminHeader onDownload={handleDownload} onShare={handleShare} />
          
          <MetricsGrid
            totalUsers={latestMetrics.total_users}
            activeUsers={latestMetrics.active_users}
            totalProperties={latestMetrics.total_properties}
            totalRevenue={latestMetrics.total_revenue}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <GrowthChart
              title="userGrowth"
              data={metrics}
              lines={[
                { key: 'total_users', name: 'totalUsers', color: '#8884d8' },
                { key: 'active_users', name: 'activeUsers', color: '#82ca9d' }
              ]}
            />
            <GrowthChart
              title="revenueGrowth"
              data={metrics}
              lines={[
                { key: 'total_revenue', name: 'totalRevenue', color: '#82ca9d' }
              ]}
              tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, t('totalRevenue')]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
