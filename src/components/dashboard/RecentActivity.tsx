import { useQuery } from "@tanstack/react-query";
import { ActivityCard } from "./activity/ActivityCard";
import { TenantActivity } from "./activity/TenantActivity";
import { PaymentActivity } from "./activity/PaymentActivity";
import { MaintenanceActivity } from "./activity/MaintenanceActivity";

export const RecentActivity = () => {
  const { isLoading: isLoadingTenants } = useQuery({ queryKey: ["recent_tenants"] });
  const { isLoading: isLoadingPayments } = useQuery({ queryKey: ["recent_payments"] });
  const { isLoading: isLoadingMaintenance } = useQuery({ queryKey: ["recent_maintenance"] });

  const isLoading = isLoadingTenants || isLoadingPayments || isLoadingMaintenance;

  return (
    <ActivityCard title="Recent Activities" isLoading={isLoading}>
      <TenantActivity />
      <PaymentActivity />
      <MaintenanceActivity />
    </ActivityCard>
  );
};