
import { Bell, AlertTriangle, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationsList } from "./NotificationsList";
import { useMaintenanceAlerts } from "@/hooks/useMaintenanceAlerts";
import { useLocale } from "@/components/providers/LocaleProvider";

export const MaintenanceNotifications = () => {
  const { notifications, budgetAlerts, paymentAlerts } = useMaintenanceAlerts();
  const { t } = useLocale();

  // Combine notifications and alerts with their respective icons
  const allNotifications = [
    ...budgetAlerts.map(alert => ({
      ...alert,
      icon: alert.type === 'budget' ? AlertTriangle : 
            alert.type === 'payment' ? CreditCard : TrendingUp,
      title: alert.type === 'budget' ? t('budgetAlert') :
             alert.type === 'payment' ? t('paymentAlert') : t('trendAlert')
    })),
    ...paymentAlerts.map(alert => ({
      ...alert,
      icon: CreditCard,
      title: t('paymentNotification')
    })),
    ...notifications.map(notif => ({
      ...notif,
      icon: Bell,
      title: t('maintenanceNotification')
    }))
  ];

  return (
    <Card className="font-sans dark-card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base dark:text-white">
          <Bell className="h-4 w-4" />
          {t('notificationsAndAlerts')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationsList notifications={allNotifications} />
      </CardContent>
    </Card>
  );
};
