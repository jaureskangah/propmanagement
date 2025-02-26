
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { useLocale } from "@/components/providers/LocaleProvider";

interface Notification {
  id: string;
  title: string;
  issue: string;
  priority: string;
  deadline?: string;
}

interface NotificationsListProps {
  notifications: Notification[];
}

export const NotificationsList = ({ notifications }: NotificationsListProps) => {
  const { t } = useLocale();

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">{t('noMaintenanceRequests')}</p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              {...notification}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
};
