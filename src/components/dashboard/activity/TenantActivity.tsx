
import { Users } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";

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
    <div className="relative">
      <Badge 
        variant="secondary" 
        className="absolute -right-1 -top-1 z-10 shadow-sm"
      >
        {t('tenant')}
      </Badge>
      <ActivityItem
        key={tenant.id}
        icon={Users}
        iconColor="text-white"
        iconBgColor="bg-blue-500"
        title={t('newTenant')}
        description={`${tenant.name} - ${t('unit')} ${tenant.unit_number}`}
        date={tenant.created_at}
      />
    </div>
  );
};
