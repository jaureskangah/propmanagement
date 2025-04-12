
import { MaintenanceRequest } from "@/components/maintenance/types";
import { Tenant } from "@/types/tenant";

export interface NotificationMessage {
  id: string;
  subject: string;
  status: string;
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

export interface NotificationBellProps {
  unreadCount: number;
  unreadMessages?: NotificationMessage[];
  maintenanceRequests?: NotificationRequest[];
  onShowAllNotifications: () => void;
}
