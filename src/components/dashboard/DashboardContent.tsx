
import { DashboardMetrics } from "./DashboardMetrics";
import { useMaintenanceAlerts } from "@/hooks/useMaintenanceAlerts";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PrioritySection } from "./PrioritySection";
import { RevenueChart } from "./RevenueChart";
import { RecentActivity } from "./RecentActivity";
import { useDashboardPreferences } from "./hooks/useDashboardPreferences";

interface DashboardContentProps {
  isLoading: boolean;
  metrics: any;
}

export const DashboardContent = ({ isLoading }: DashboardContentProps) => {
  useRealtimeNotifications();
  const { notifications, budgetAlerts, paymentAlerts } = useMaintenanceAlerts();
  const { preferences } = useDashboardPreferences();

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

  const { data: paymentsData = [] } = useQuery({
    queryKey: ['tenant_payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenant_payments').select('*');
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

  const isHidden = (sectionId: string) => preferences.hidden_sections.includes(sectionId);

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

      {!isHidden('priority') && (
        <PrioritySection
          maintenanceData={maintenanceData}
          tenantsData={tenantsData}
          paymentsData={paymentsData}
        />
      )}

      {!isHidden('revenue') && (
        <RevenueChart />
      )}

      {!isHidden('activity') && (
        <RecentActivity />
      )}
    </div>
  );
};
