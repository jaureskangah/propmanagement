
import { useMemo } from "react";
import { Activity } from "../activityTypes";
import { TenantActivity } from "@/components/dashboard/activity/TenantActivity";
import { PaymentActivity } from "@/components/dashboard/activity/PaymentActivity";
import { MaintenanceActivity } from "@/components/dashboard/activity/MaintenanceActivity";

export function useTransformedActivities(
  tenants: any[] = [],
  payments: any[] = [],
  maintenance: any[] = []
) {
  return useMemo(() => {
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

    // Tri par date décroissante
    const sorted = combinedActivities.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    console.log("Toutes les activités combinées:", sorted.length);
    return sorted;
  }, [tenants, payments, maintenance]);
}
