import { MaintenanceMetrics } from "../MaintenanceMetrics";
import { MaintenanceNotifications } from "../MaintenanceNotifications";

interface MaintenanceMetricsSectionProps {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
  urgentRequests: number;
}

export const MaintenanceMetricsSection = ({
  totalRequests,
  pendingRequests,
  resolvedRequests,
  urgentRequests,
}: MaintenanceMetricsSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="lg:col-span-2 order-2 lg:order-1">
        <MaintenanceMetrics
          totalRequests={totalRequests}
          pendingRequests={pendingRequests}
          resolvedRequests={resolvedRequests}
          urgentRequests={urgentRequests}
        />
      </div>
      <div className="lg:col-span-1 order-1 lg:order-2">
        <MaintenanceNotifications />
      </div>
    </div>
  );
};