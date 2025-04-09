
import { ArrowUpRight, ArrowDownRight, Building2, Users, Wrench, MessageSquare } from "lucide-react";
import { DashboardMetric } from "@/components/DashboardMetric";
import { cn } from "@/lib/utils";
import { SortableMetric } from "./SortableMetric";
import { MetricsData } from "./types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEffect } from "react";

interface MetricRenderersProps {
  metrics: MetricsData;
  unreadMessages: number;
  dateRange?: any;
}

export const MetricRenderers = ({ metrics, unreadMessages, dateRange }: MetricRenderersProps) => {
  const { t } = useLocale();

  // Log metrics data for debugging
  useEffect(() => {
    console.log("Metrics data in renderers:", {
      properties: metrics.properties?.chartData?.length,
      tenants: metrics.tenants?.chartData?.length,
      maintenance: metrics.maintenance?.chartData?.length,
      communications: metrics.communications?.chartData?.length,
      dateRange
    });
  }, [metrics, dateRange]);

  const renderProperties = () => (
    <SortableMetric key="properties" id="properties">
      <DashboardMetric
        title={t('properties')}
        value={metrics.properties.total.toString()}
        icon={<Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
        chartData={metrics.properties.chartData}
        tooltip={t('properties')}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/40"
      />
    </SortableMetric>
  );

  const renderTenants = () => (
    <SortableMetric key="tenants" id="tenants">
      <DashboardMetric
        title={t('tenants')}
        value={metrics.tenants.total.toString()}
        icon={<Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
        chartData={metrics.tenants.chartData}
        tooltip={t('tenants')}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-800/30 hover:border-purple-200 dark:hover:border-purple-700/40"
        chartColor="#818CF8"
      />
    </SortableMetric>
  );

  const renderMaintenance = () => (
    <SortableMetric key="maintenance" id="maintenance">
      <DashboardMetric
        title={t('maintenance')}
        value={metrics.maintenance.pending.toString()}
        icon={<Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
        chartData={metrics.maintenance.chartData}
        tooltip={t('maintenance')}
        className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-100 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-700/40"
        chartColor="#F59E0B"
      />
    </SortableMetric>
  );

  const renderMessages = () => {
    return (
      <SortableMetric key="messages" id="messages">
        <DashboardMetric
          title={t('unreadMessages')}
          value={unreadMessages.toString()}
          icon={<MessageSquare className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
          chartData={metrics.communications.chartData}
          tooltip={t('unreadMessages')}
          className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-100 dark:border-rose-800/30 hover:border-rose-200 dark:hover:border-rose-700/40"
          chartColor="#F43F5E"
        />
      </SortableMetric>
    );
  };

  return {
    renderProperties,
    renderTenants,
    renderMaintenance,
    renderMessages,
  };
};
