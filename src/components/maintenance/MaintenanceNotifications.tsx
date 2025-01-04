import { Bell, AlertTriangle, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationsList } from "./NotificationsList";
import { useMaintenanceAlerts } from "@/hooks/useMaintenanceAlerts";

export const MaintenanceNotifications = () => {
  const { notifications, budgetAlerts } = useMaintenanceAlerts();

  // Combine notifications and alerts with their respective icons
  const allNotifications = [
    ...budgetAlerts.map(alert => ({
      ...alert,
      icon: alert.type === 'budget' ? AlertTriangle : 
            alert.type === 'payment' ? CreditCard : TrendingUp
    })),
    ...notifications.map(notif => ({
      ...notif,
      icon: Bell
    }))
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4" />
          Notifications and Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationsList notifications={allNotifications} />
      </CardContent>
    </Card>
  );
};