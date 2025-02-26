
import { Wrench } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceActivityProps {
  request: {
    id: string;
    issue: string;
    created_at: string;
  };
}

export const MaintenanceActivity = ({ request }: MaintenanceActivityProps) => {
  const { t } = useLocale();
  
  return (
    <ActivityItem
      key={request.id}
      icon={Wrench}
      iconColor="text-amber-600"
      iconBgColor="bg-amber-100"
      title={t('maintenanceCompleted')}
      description={request.issue}
      date={request.created_at}
    />
  );
};
