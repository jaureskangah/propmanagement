import { DashboardMetric } from "@/components/DashboardMetric";
import { Wrench, HourglassIcon, CheckCircle2, AlertTriangle } from "lucide-react";

interface MaintenanceMetricsProps {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
  urgentRequests: number;
}

export const MaintenanceMetrics = ({
  totalRequests,
  pendingRequests,
  resolvedRequests,
  urgentRequests,
}: MaintenanceMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <DashboardMetric
        title="Total Requests"
        value={totalRequests.toString()}
        icon={<Wrench className="h-4 w-4 text-blue-500" />}
        description="All maintenance requests"
      />
      <DashboardMetric
        title="Pending Requests"
        value={pendingRequests.toString()}
        icon={<HourglassIcon className="h-4 w-4 text-yellow-500" />}
        description="Awaiting resolution"
      />
      <DashboardMetric
        title="Resolved Requests"
        value={resolvedRequests.toString()}
        icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
        description="Completed maintenance tasks"
      />
      <DashboardMetric
        title="Urgent Issues"
        value={urgentRequests.toString()}
        icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
        description="High priority requests"
      />
    </div>
  );
};