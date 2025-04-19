
import { NotificationBellProps } from "./notifications/types";
import { NotificationDropdown } from "./notifications/NotificationDropdown";

export const NotificationBell = ({ 
  unreadCount, 
  maintenanceRequests = [],
  onShowAllNotifications
}: NotificationBellProps) => {
  // Don't show anything if there are no notifications
  if (unreadCount === 0) return null;

  return (
    <NotificationDropdown
      unreadCount={unreadCount}
      maintenanceRequests={maintenanceRequests}
      onShowAllNotifications={onShowAllNotifications}
    />
  );
};
