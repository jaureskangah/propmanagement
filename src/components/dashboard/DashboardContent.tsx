
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardCustomization } from "./DashboardCustomization";
import { useMaintenanceAlerts } from "@/hooks/useMaintenanceAlerts";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface DashboardContentProps {
  isLoading: boolean;
  metrics: any;
}

export const DashboardContent = ({ isLoading }: DashboardContentProps) => {
  // Utilisation du hook pour les notifications en temps réel
  useRealtimeNotifications();
  const { notifications, budgetAlerts, paymentAlerts } = useMaintenanceAlerts();

  // Fetch properties, maintenance, and tenants data
  const { data: propertiesData = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: maintenanceData = [] } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase.from('maintenance_requests').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: tenantsData = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenants').select('*');
      if (error) throw error;
      return data;
    }
  });

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
        propertiesData={propertiesData}
        maintenanceData={maintenanceData}
        tenantsData={tenantsData}
        dateRange={{
          startDate: new Date(),
          endDate: new Date()
        }}
      />
      <DashboardCustomization />
    </div>
  );
};
