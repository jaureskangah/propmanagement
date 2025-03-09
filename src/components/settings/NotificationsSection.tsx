
import { Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Profile } from "@/types/profile";

interface NotificationsSectionProps {
  profile: Profile | null;
  isLoading: boolean;
  onUpdatePreference: (type: 'push_notifications' | 'email_updates', value: boolean) => Promise<void>;
}

export function NotificationsSection({ profile, isLoading, onUpdatePreference }: NotificationsSectionProps) {
  const { t } = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('notifications')}
        </CardTitle>
        <CardDescription>
          {t('notificationsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{t('pushNotifications')}</p>
            <p className="text-sm text-muted-foreground">{t('pushNotificationsDescription')}</p>
          </div>
          <Switch 
            checked={profile?.push_notifications ?? true}
            onCheckedChange={(checked) => onUpdatePreference('push_notifications', checked)}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{t('emailUpdates')}</p>
            <p className="text-sm text-muted-foreground">{t('emailUpdatesDescription')}</p>
          </div>
          <Switch 
            checked={profile?.email_updates ?? true}
            onCheckedChange={(checked) => onUpdatePreference('email_updates', checked)}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
