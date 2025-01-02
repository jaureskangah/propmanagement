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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
      <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <DashboardMetric
          title="Total Requests"
          value={totalRequests.toString()}
          icon={<Wrench className="h-4 w-4 text-blue-500 animate-pulse" />}
          description="All maintenance requests"
          className="relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        />
      </div>

      <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <DashboardMetric
          title="Pending Requests"
          value={pendingRequests.toString()}
          icon={<HourglassIcon className="h-4 w-4 text-yellow-500 animate-spin-slow" />}
          description="Awaiting resolution"
          className="relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-500/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        />
      </div>

      <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <DashboardMetric
          title="Resolved Requests"
          value={resolvedRequests.toString()}
          icon={<CheckCircle2 className="h-4 w-4 text-green-500 animate-bounce" />}
          description="Completed maintenance tasks"
          className="relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-500/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        />
      </div>

      <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <DashboardMetric
          title="Urgent Issues"
          value={urgentRequests.toString()}
          icon={<AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />}
          description="High priority requests"
          className="relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        />
      </div>
    </div>
  );
};