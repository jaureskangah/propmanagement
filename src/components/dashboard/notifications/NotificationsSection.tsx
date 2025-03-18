
import { Button } from "@/components/ui/button";
import { MessageSquare, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { MessageNotificationItem } from "./MessageNotificationItem";
import { MaintenanceNotificationItem } from "./MaintenanceNotificationItem";
import { NotificationMessage, NotificationRequest } from "./types";

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
  const navigate = useNavigate();

  if (unreadMessages.length === 0 && maintenanceRequests.length === 0) {
    return (
      <div className="px-3 py-4 text-center text-muted-foreground">
        {t('noNotifications')}
      </div>
    );
  }

  return (
    <>
      {unreadMessages.length > 0 && (
        <>
          <div className="px-3 py-1">
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <MessageSquare className="h-3 w-3" />
              {t('unreadMessages')} 
              <Badge variant="outline" className="ml-auto text-[10px] h-4">
                {unreadMessages.length}
              </Badge>
            </div>
          </div>
          
          {unreadMessages.slice(0, 3).map((message) => (
            <MessageNotificationItem key={message.id} message={message} t={t} />
          ))}
          
          {unreadMessages.length > 3 && (
            <div className="px-3 py-1">
              <Button 
                variant="link" 
                className="w-full h-8 text-xs"
                onClick={() => navigate('/tenants')}
              >
                +{unreadMessages.length - 3} {t('more')}...
              </Button>
            </div>
          )}
          
          {maintenanceRequests.length > 0 && <DropdownMenuSeparator />}
        </>
      )}
      
      {maintenanceRequests.length > 0 && (
        <>
          <div className="px-3 py-1">
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <Wrench className="h-3 w-3" />
              {t('maintenanceRequests')}
              <Badge variant="outline" className="ml-auto text-[10px] h-4">
                {maintenanceRequests.length}
              </Badge>
            </div>
          </div>
          
          {maintenanceRequests.slice(0, 3).map((request) => (
            <MaintenanceNotificationItem key={request.id} request={request} t={t} />
          ))}
          
          {maintenanceRequests.length > 3 && (
            <div className="px-3 py-1">
              <Button 
                variant="link" 
                className="w-full h-8 text-xs"
                onClick={() => navigate('/maintenance')}
              >
                +{maintenanceRequests.length - 3} {t('more')}...
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};
