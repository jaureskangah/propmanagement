import { DashboardMetric } from "@/components/DashboardMetric";
import { Building2, Users, Wrench, DollarSign, ArrowUpRight, ArrowDownRight, Percent, MessageSquare } from "lucide-react";
import { DateRange } from "./DashboardDateFilter";
import { NotificationBell } from "./NotificationBell";
import { useMetricsData } from "./hooks/useMetricsData";
import { cn } from "@/lib/utils";

interface DashboardMetricsProps {
  propertiesData: any[];
  maintenanceData: any[];
  tenantsData: any[];
  dateRange: DateRange;
}

export const DashboardMetrics = ({ 
  propertiesData, 
  maintenanceData, 
  tenantsData,
  dateRange 
}: DashboardMetricsProps) => {
  const { metrics, unreadMessages } = useMetricsData(
    propertiesData,
    maintenanceData,
    tenantsData,
    dateRange
  );

  return (
    <div className="relative">
      <NotificationBell unreadCount={unreadMessages} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
          tooltip="Taux d'occupation global de vos propriétés. Un taux élevé indique une bonne gestion locative."
        />

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
          tooltip="Nombre total de propriétés dans votre portefeuille et évolution mensuelle."
        />

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
          tooltip="Nombre total de locataires actifs et taux d'occupation correspondant."
        />

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
          tooltip="Demandes de maintenance en attente nécessitant votre attention."
        />

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
          tooltip="Revenus mensuels basés sur les baux actuels et historique des paiements."
        />

        <DashboardMetric
          title="Unread Messages"
          value={unreadMessages.toString()}
          icon={<MessageSquare className="h-4 w-4 text-rose-600" />}
          description={
            <div className="flex items-center gap-1 text-rose-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>Messages requiring attention</span>
            </div>
          }
          chartData={metrics.communications?.chartData || []}
          chartColor="#E11D48"
          tooltip="Messages non lus de vos locataires nécessitant une réponse."
        />
      </div>
    </div>
  );
};