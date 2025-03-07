
import { Wrench } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";

interface MaintenanceActivityProps {
  request: {
    id: string;
    issue: string;
    created_at: string;
  };
}

export const MaintenanceActivity = ({ request }: MaintenanceActivityProps) => {
  const { t } = useLocale();
  
  // Format details for hover card
  const details = {
    [t('requestId')]: request.id,
    [t('issueDetails')]: request.issue,
    [t('status')]: t('completed'),
    [t('completionDate')]: new Date(request.created_at).toLocaleDateString()
  };
  
  return (
    <div className="relative">
      <Badge 
        variant="warning" 
        className="absolute -right-1 -top-1 z-10 shadow-sm"
      >
        {t('maintenance')}
      </Badge>
      <ActivityItem
        key={request.id}
        icon={Wrench}
        iconColor="text-white"
        iconBgColor="bg-amber-500"
        title={t('maintenanceCompleted')}
        description={request.issue}
        date={request.created_at}
        details={details}
      />
    </div>
  );
};
