import { Users } from "lucide-react";
import { ActivityItem } from "./ActivityItem";

interface TenantActivityProps {
  tenant: {
    id: string;
    name: string;
    unit_number: string;
    created_at: string;
  };
}

export const TenantActivity = ({ tenant }: TenantActivityProps) => {
  return (
    <ActivityItem
      key={tenant.id}
      icon={Users}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100"
      title="New Tenant"
      description={`${tenant.name} - Apartment ${tenant.unit_number}`}
      date={tenant.created_at}
    />
  );
};