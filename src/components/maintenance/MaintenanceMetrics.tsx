import { DashboardMetric } from "@/components/DashboardMetric";
import { 
  Wrench, 
  HourglassIcon, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

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
  // Calculate trends (example values - you might want to calculate these based on historical data)
  const pendingTrend = pendingRequests > 5 ? "up" : "down";
  const resolutionRate = totalRequests > 0 ? (resolvedRequests / totalRequests) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
      <DashboardMetric
        title="Total Requests"
        value={totalRequests.toString()}
        icon={<Wrench className="h-4 w-4 text-blue-500 animate-pulse" />}
        description={
          <div className="flex items-center gap-1">
            <span>{resolutionRate.toFixed(1)}% resolution rate</span>
          </div>
        }
        chartColor="#1E40AF"
        className="relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
      />

      <DashboardMetric
        title="Pending Requests"
        value={pendingRequests.toString()}
        icon={<HourglassIcon className="h-4 w-4 text-yellow-500 animate-spin-slow" />}
        description={
          <div className="flex items-center gap-1">
            {pendingTrend === "up" ? (
              <>
                <TrendingUp className="h-3 w-3 text-red-500" />
                <span className="text-red-500">Increasing trend</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-green-500">Decreasing trend</span>
              </>
            )}
          </div>
        }
        chartColor="#EAB308"
        className="relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-500/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
      />

      <DashboardMetric
        title="Resolved Requests"
        value={resolvedRequests.toString()}
        icon={<CheckCircle2 className="h-4 w-4 text-green-500 animate-bounce" />}
        description={
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-500">Well managed</span>
          </div>
        }
        chartColor="#22C55E"
        className="relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-500/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
      />

      <DashboardMetric
        title="Urgent Issues"
        value={urgentRequests.toString()}
        icon={<AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />}
        description={
          <div className="flex items-center gap-1">
            {urgentRequests > 0 ? (
              <>
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span className="text-red-500">Needs attention</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span className="text-green-500">All clear</span>
              </>
            )}
          </div>
        }
        chartColor="#EF4444"
        className="relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
      />
    </div>
  );
};