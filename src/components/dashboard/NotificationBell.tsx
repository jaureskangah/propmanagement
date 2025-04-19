
import { NotificationBellProps } from "./notifications/types";
import { NotificationDropdown } from "./notifications/NotificationDropdown";

export const NotificationBell = ({ 
  unreadCount, 
  unreadMessages = [], 
  maintenanceRequests = [],
  onShowAllNotifications
}: NotificationBellProps) => {
  // Don't show anything if there are no notifications
  if (unreadCount === 0) return null;

  return (
    <div className="relative z-50">
      <NotificationDropdown
        unreadCount={unreadCount}
        unreadMessages={unreadMessages}
        maintenanceRequests={maintenanceRequests}
        onShowAllNotifications={onShowAllNotifications}
      />
    </div>
  );
};
