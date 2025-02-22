
import { useQuery } from "@tanstack/react-query";
import { ActivityCard } from "./activity/ActivityCard";
import { TenantActivity } from "./activity/TenantActivity";
import { PaymentActivity } from "./activity/PaymentActivity";
import { MaintenanceActivity } from "./activity/MaintenanceActivity";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Activity {
  id: string;
  created_at: string;
  type: 'tenant' | 'payment' | 'maintenance';
  component: JSX.Element;
}

export const RecentActivity = () => {
  const [allActivities, setAllActivities] = useState<Activity[]>([]);

  const { data: tenants, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["recent_tenants"],
    queryFn: async () => {
      console.log("Fetching recent tenants...");
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      console.log("Recent tenants data:", data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["recent_payments"],
    queryFn: async () => {
      console.log("Fetching recent payments...");
      const { data, error } = await supabase
        .from("tenant_payments")
        .select(`
          *,
          tenants (
            unit_number
          )
        `)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      console.log("Recent payments data:", data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: maintenance, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["recent_maintenance"],
    queryFn: async () => {
      console.log("Fetching recent maintenance requests...");
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      console.log("Recent maintenance data:", data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    console.log("RecentActivity loading state:", {
      isLoadingTenants,
      isLoadingPayments,
      isLoadingMaintenance,
      hasTenantsData: !!tenants?.length,
      hasPaymentsData: !!payments?.length,
      hasMaintenanceData: !!maintenance?.length
    });
  }, [isLoadingTenants, isLoadingPayments, isLoadingMaintenance, tenants, payments, maintenance]);

  useEffect(() => {
    if (tenants && payments && maintenance) {
      const combinedActivities: Activity[] = [
        ...(tenants?.map(tenant => ({
          id: tenant.id,
          created_at: tenant.created_at,
          type: 'tenant' as const,
          component: <TenantActivity tenant={tenant} />
        })) || []),
        ...(payments?.map(payment => ({
          id: payment.id,
          created_at: payment.created_at,
          type: 'payment' as const,
          component: <PaymentActivity payment={payment} />
        })) || []),
        ...(maintenance?.map(request => ({
          id: request.id,
          created_at: request.created_at,
          type: 'maintenance' as const,
          component: <MaintenanceActivity request={request} />
        })) || [])
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      console.log("Setting combined activities:", {
        totalActivities: combinedActivities.length,
        byType: {
          tenants: combinedActivities.filter(a => a.type === 'tenant').length,
          payments: combinedActivities.filter(a => a.type === 'payment').length,
          maintenance: combinedActivities.filter(a => a.type === 'maintenance').length,
        }
      });

      setAllActivities(combinedActivities);
    }
  }, [tenants, payments, maintenance]);

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingMaintenance;

  return (
    <ActivityCard title="Recent Activities" isLoading={isLoading}>
      {allActivities.map(activity => (
        <div key={`${activity.type}-${activity.id}`}>
          {activity.component}
        </div>
      ))}
    </ActivityCard>
  );
};
