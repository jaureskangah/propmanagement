
import { MaintenanceNotificationItem } from "./MaintenanceNotificationItem";
import { NotificationRequest } from "./types";
import { DropdownMenuGroup, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Wrench } from "lucide-react";

interface NotificationsSectionProps {
  maintenanceRequests: NotificationRequest[];
  t: (key: string) => string;
}

export const NotificationsSection = ({ 
  maintenanceRequests,
  t
}: NotificationsSectionProps) => {
  if (maintenanceRequests.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {t('noNotifications')}
      </div>
    );
  }
  
  return (
    <DropdownMenuGroup>
      <div className="px-3 py-2 text-xs text-muted-foreground flex items-center">
        <Wrench className="h-3.5 w-3.5 mr-1" />
        {t('maintenanceRequests')}
      </div>
      <DropdownMenuSeparator />
      {maintenanceRequests.map(request => (
        <MaintenanceNotificationItem 
          key={request.id} 
          request={request} 
          t={t} 
        />
      ))}
    </DropdownMenuGroup>
  );
};
