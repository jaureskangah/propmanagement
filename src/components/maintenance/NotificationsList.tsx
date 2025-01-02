import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";

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
  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            {...notification}
          />
        ))}
      </div>
    </ScrollArea>
  );
};