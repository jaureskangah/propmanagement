
export interface NotificationRequest {
  id: string;
  issue: string;
  status: string;
  priority: string;
  created_at: string;
  tenants?: {
    id: string;
    name: string;
    unit_number: string;
    properties?: {
      name: string;
    };
  };
}

export interface NotificationMessage {
  id: string;
  subject: string;
  created_at: string;
  status: string;
  tenants?: {
    id: string;
    name: string;
    unit_number: string;
    properties?: {
      name: string;
    };
  };
}

export interface NotificationBellProps {
  unreadCount: number;
  maintenanceRequests: NotificationRequest[];
}

