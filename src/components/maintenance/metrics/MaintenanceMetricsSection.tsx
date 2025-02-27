
import { useEffect, useState } from "react";
import { MaintenanceMetrics } from "../MaintenanceMetrics";
import { MaintenanceNotifications } from "../MaintenanceNotifications";
import { supabase } from "@/lib/supabase";

interface MaintenanceMetricsSectionProps {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
  urgentRequests: number;
}

export const MaintenanceMetricsSection = ({
  totalRequests: initialTotal,
  pendingRequests: initialPending,
  resolvedRequests: initialResolved,
  urgentRequests: initialUrgent,
}: MaintenanceMetricsSectionProps) => {
  const [metrics, setMetrics] = useState({
    totalRequests: initialTotal,
    pendingRequests: initialPending,
    resolvedRequests: initialResolved,
    urgentRequests: initialUrgent,
  });

  useEffect(() => {
    setMetrics({
      totalRequests: initialTotal,
      pendingRequests: initialPending,
      resolvedRequests: initialResolved,
      urgentRequests: initialUrgent,
    });
  }, [initialTotal, initialPending, initialResolved, initialUrgent]);

  useEffect(() => {
    const channel = supabase
      .channel('maintenance-metrics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests'
        },
        async () => {
          const { data: requests, error } = await supabase
            .from('maintenance_requests')
            .select('status, priority');
            
          if (error) {
            console.error('Error fetching updated maintenance metrics:', error);
            return;
          }

          const total = requests.length;
          const pending = requests.filter(r => r.status === 'Pending').length;
          const resolved = requests.filter(r => r.status === 'Resolved').length;
          const urgent = requests.filter(r => r.priority === 'Urgent').length;

          setMetrics({
            totalRequests: total,
            pendingRequests: pending,
            resolvedRequests: resolved,
            urgentRequests: urgent,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div className="lg:col-span-2 order-2 lg:order-1">
        <MaintenanceMetrics
          total={metrics.totalRequests}
          pending={metrics.pendingRequests}
          resolved={metrics.resolvedRequests}
        />
      </div>
      <div className="lg:col-span-1 order-1 lg:order-2">
        <MaintenanceNotifications />
      </div>
    </div>
  );
};
