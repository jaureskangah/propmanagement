
export interface NotificationMessage {
  id: string;
  tenants?: {
    id: string;
    name: string;
    properties?: {
      name: string;
    };
    unit_number: string;
  };
  subject?: string;
}

export interface NotificationRequest {
  id: string;
  issue: string;
  priority: string;
  tenants?: {
    id: string;
    name: string;
    properties?: {
      name: string;
    };
    unit_number: string;
  };
}

export interface NotificationBellProps {
  unreadCount: number;
  unreadMessages: NotificationMessage[];
  maintenanceRequests: NotificationRequest[];
  onShowAllNotifications: () => void;
}
