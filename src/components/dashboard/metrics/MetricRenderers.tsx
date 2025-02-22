import { ArrowUpRight, ArrowDownRight, Percent, Building2, Users, Wrench, DollarSign, MessageSquare } from "lucide-react";
import { DashboardMetric } from "@/components/DashboardMetric";
import { cn } from "@/lib/utils";
import { SortableMetric } from "./SortableMetric";
import { MetricsData } from "./types";

interface MetricRenderersProps {
  metrics: MetricsData;
  unreadMessages: number;
}

export const MetricRenderers = ({ metrics, unreadMessages }: MetricRenderersProps) => {
  const renderOccupancy = () => (
    <SortableMetric key="occupancy" id="occupancy">
      <DashboardMetric
        title="Global Occupancy"
        value={`${metrics.occupancy.rate}%`}
        icon={<Percent className="h-4 w-4 text-violet-600" />}
        description={
          <div className={cn(
            "flex items-center gap-1",
            metrics.occupancy.trend >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {metrics.occupancy.trend >= 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            <span>{Math.abs(metrics.occupancy.trend)}% from last month</span>
          </div>
        }
        chartData={metrics.occupancy.chartData}
        chartColor="#7C3AED"
        tooltip="Global occupancy rate of your properties. A high rate indicates effective rental management."
      />
    </SortableMetric>
  );

  const renderProperties = () => (
    <SortableMetric key="properties" id="properties">
      <DashboardMetric
        title="Properties"
        value={metrics.properties.total.toString()}
        icon={<Building2 className="h-4 w-4 text-blue-600" />}
        description={
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>{metrics.properties.new} new this month</span>
          </div>
        }
        chartData={metrics.properties.chartData}
        chartColor="#1E40AF"
        tooltip="Total number of properties in your portfolio and monthly evolution."
      />
    </SortableMetric>
  );

  const renderTenants = () => (
    <SortableMetric key="tenants" id="tenants">
      <DashboardMetric
        title="Tenants"
        value={metrics.tenants.total.toString()}
        icon={<Users className="h-4 w-4 text-indigo-600" />}
        description={
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>{metrics.tenants.occupancyRate}% occupancy rate</span>
          </div>
        }
        chartData={metrics.tenants.chartData}
        chartColor="#4F46E5"
        tooltip="Total number of active tenants and corresponding occupancy rate."
      />
    </SortableMetric>
  );

  const renderMaintenance = () => (
    <SortableMetric key="maintenance" id="maintenance">
      <DashboardMetric
        title="Maintenance"
        value={metrics.maintenance.pending.toString()}
        icon={<Wrench className="h-4 w-4 text-amber-600" />}
        description={
          <div className="flex items-center gap-1 text-red-600">
            <ArrowDownRight className="h-3 w-3" />
            <span>{metrics.maintenance.pending} pending requests</span>
          </div>
        }
        chartData={metrics.maintenance.chartData}
        chartColor="#D97706"
        tooltip="Pending maintenance requests requiring your attention."
      />
    </SortableMetric>
  );

  const renderRevenue = () => (
    <SortableMetric key="revenue" id="revenue">
      <DashboardMetric
        title="Monthly Revenue"
        value={`$${metrics.revenue.monthly.toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
        description={
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>Based on current leases</span>
          </div>
        }
        chartData={metrics.revenue.chartData}
        chartColor="#059669"
        tooltip="Monthly revenue based on current leases and payment history."
      />
    </SortableMetric>
  );

  const renderMessages = () => {
    // Générer des données fictives pour le graphique si aucune donnée n'est disponible
    const defaultChartData = Array.from({ length: 7 }, (_, i) => ({
      value: Math.max(0, unreadMessages + Math.floor(Math.random() * 5) - 2)
    }));

    return (
      <SortableMetric key="messages" id="messages">
        <DashboardMetric
          title="Unread Messages"
          value={unreadMessages.toString()}
          icon={<MessageSquare className="h-4 w-4 text-rose-600" />}
          description={
            <div className={cn(
              "flex items-center gap-1",
              unreadMessages > 0 ? "text-rose-600" : "text-green-600"
            )}>
              <ArrowUpRight className="h-3 w-3" />
              <span>{unreadMessages === 1 ? "message" : "messages"} requiring attention</span>
            </div>
          }
          chartData={metrics.communications?.chartData || defaultChartData}
          chartColor="#E11D48"
          tooltip="Messages from your tenants requiring a response"
        />
      </SortableMetric>
    );
  };

  return {
    renderOccupancy,
    renderProperties,
    renderTenants,
    renderMaintenance,
    renderRevenue,
    renderMessages,
  };
};
