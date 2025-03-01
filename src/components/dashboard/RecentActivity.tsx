
import { useQuery } from "@tanstack/react-query";
import { ActivityCard } from "./activity/ActivityCard";
import { TenantActivity } from "./activity/TenantActivity";
import { PaymentActivity } from "./activity/PaymentActivity";
import { MaintenanceActivity } from "./activity/MaintenanceActivity";
import { useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

interface Activity {
  id: string;
  created_at: string;
  type: 'tenant' | 'payment' | 'maintenance';
  component: JSX.Element;
}

export const RecentActivity = () => {
  const { t } = useLocale();

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ["recent_tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["recent_payments"],
    queryFn: async () => {
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
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  const { data: maintenance = [], isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["recent_maintenance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  const allActivities = useMemo(() => {
    if (!tenants || !payments || !maintenance) return [];

    const combinedActivities: Activity[] = [
      ...tenants.map(tenant => ({
        id: tenant.id,
        created_at: tenant.created_at,
        type: 'tenant' as const,
        component: <TenantActivity tenant={tenant} />
      })),
      ...payments.map(payment => ({
        id: payment.id,
        created_at: payment.created_at,
        type: 'payment' as const,
        component: <PaymentActivity payment={payment} />
      })),
      ...maintenance.map(request => ({
        id: request.id,
        created_at: request.created_at,
        type: 'maintenance' as const,
        component: <MaintenanceActivity request={request} />
      }))
    ];

    return combinedActivities.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [tenants, payments, maintenance]);

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingMaintenance;

  return (
    <ActivityCard title={t('recentActivity')} isLoading={isLoading}>
      {allActivities.map(activity => (
        <div key={`${activity.type}-${activity.id}`}>
          {activity.component}
        </div>
      ))}
    </ActivityCard>
  );
};
