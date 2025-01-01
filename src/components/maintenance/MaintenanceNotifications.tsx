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
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications and Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationsList notifications={allNotifications} />
      </CardContent>
    </Card>
  );
};