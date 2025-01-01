import { Wrench } from "lucide-react";
import { ActivityItem } from "./ActivityItem";

interface MaintenanceActivityProps {
  request: {
    id: string;
    issue: string;
    created_at: string;
  };
}

export const MaintenanceActivity = ({ request }: MaintenanceActivityProps) => {
  return (
    <ActivityItem
      key={request.id}
      icon={Wrench}
      iconColor="text-amber-600"
      iconBgColor="bg-amber-100"
      title="Maintenance Completed"
      description={request.issue}
      date={request.created_at}
    />
  );
};