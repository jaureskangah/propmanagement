import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";

interface MaintenanceMetricsSectionProps {
  metrics: {
    total: number;
    pending: number;
    resolved: number;
  };
}

export const MaintenanceMetricsSection = ({ metrics }: MaintenanceMetricsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MaintenanceMetrics
        total={metrics.total}
        pending={metrics.pending}
        resolved={metrics.resolved}
      />
    </div>
  );
};