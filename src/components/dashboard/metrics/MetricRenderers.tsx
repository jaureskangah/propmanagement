
import { Building2, Users, Wrench } from "lucide-react";
import { DashboardMetric } from "@/components/DashboardMetric";
import { cn } from "@/lib/utils";
import { SortableMetric } from "./SortableMetric";
import { MetricsData } from "./types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useEffect } from "react";

interface MetricRenderersProps {
  metrics: MetricsData;
  dateRange?: any;
}

export const MetricRenderers = ({ metrics, dateRange }: MetricRenderersProps) => {
  const { t } = useLocale();

  useEffect(() => {
    console.log("Metrics data in renderers:", {
      properties: metrics.properties?.chartData?.length,
      tenants: metrics.tenants?.chartData?.length,
      maintenance: metrics.maintenance?.chartData?.length,
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
        title={t('pendingMaintenance')}
        value={metrics.maintenance.pending.toString()}
        icon={<Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
        chartData={metrics.maintenance.chartData}
        tooltip={t('pendingMaintenance')}
        className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-100 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-700/40"
        chartColor="#F59E0B"
      />
    </SortableMetric>
  );

  return {
    renderProperties,
    renderTenants,
    renderMaintenance,
  };
};
