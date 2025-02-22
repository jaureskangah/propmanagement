
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardCustomization } from "./DashboardCustomization";
import { useMaintenanceAlerts } from "@/hooks/useMaintenanceAlerts";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

interface DashboardContentProps {
  isLoading: boolean;
  metrics: any;
}

export const DashboardContent = ({ isLoading, metrics }: DashboardContentProps) => {
  // Utilisation du hook pour les notifications en temps réel
  useRealtimeNotifications();
  const { notifications, budgetAlerts, paymentAlerts } = useMaintenanceAlerts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardMetrics 
        metrics={metrics}
      />
      <DashboardCustomization 
        notifications={notifications}
        budgetAlerts={budgetAlerts}
        paymentAlerts={paymentAlerts}
      />
    </div>
  );
};
