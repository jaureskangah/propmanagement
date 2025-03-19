
import { MessageNotificationItem } from "./MessageNotificationItem";
import { MaintenanceNotificationItem } from "./MaintenanceNotificationItem";
import { NotificationMessage, NotificationRequest } from "./types";
import { DropdownMenuGroup, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MessageSquare, Wrench } from "lucide-react";

interface NotificationsSectionProps {
  unreadMessages: NotificationMessage[];
  maintenanceRequests: NotificationRequest[];
  t: (key: string) => string;
}

export const NotificationsSection = ({ 
  unreadMessages, 
  maintenanceRequests,
  t
}: NotificationsSectionProps) => {
  if (unreadMessages.length === 0 && maintenanceRequests.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {t('noNotifications')}
      </div>
    );
  }
  
  return (
    <>
      {unreadMessages.length > 0 && (
        <DropdownMenuGroup>
          <div className="px-3 py-2 text-xs text-muted-foreground flex items-center">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            {t('unreadMessages')}
          </div>
          <DropdownMenuSeparator />
          {unreadMessages.map(message => (
            <MessageNotificationItem 
              key={message.id} 
              message={message} 
              t={t} 
            />
          ))}
        </DropdownMenuGroup>
      )}
      
      {unreadMessages.length > 0 && maintenanceRequests.length > 0 && (
        <DropdownMenuSeparator />
      )}
      
      {maintenanceRequests.length > 0 && (
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
      )}
    </>
  );
};
