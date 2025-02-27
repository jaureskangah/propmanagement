
import { Users } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantActivityProps {
  tenant: {
    id: string;
    name: string;
    unit_number: string;
    created_at: string;
  };
}

export const TenantActivity = ({ tenant }: TenantActivityProps) => {
  const { t } = useLocale();
  
  return (
    <ActivityItem
      key={tenant.id}
      icon={Users}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100"
      title={t('newTenant')}
      description={`${tenant.name} - ${t('unit')} ${tenant.unit_number}`}
      date={tenant.created_at}
    />
  );
};
