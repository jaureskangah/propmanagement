
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
    <Card className="transition-all duration-300 hover:shadow-md overflow-hidden border-border">
      <div className="h-1 bg-amber-500" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Bell className="h-5 w-5 text-amber-500 dark:text-amber-400" />
          </div>
          {t('notifications')}
        </CardTitle>
        <CardDescription>
          {t('notificationsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex justify-between items-start">
          <div>
            <p className="font-medium">{t('pushNotifications')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('pushNotificationsDescription')}</p>
          </div>
          <Switch 
            className="mt-1"
            checked={profile?.push_notifications ?? true}
            onCheckedChange={(checked) => onUpdatePreference('push_notifications', checked)}
            disabled={isLoading}
          />
        </div>
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex justify-between items-start">
          <div>
            <p className="font-medium">{t('emailUpdates')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('emailUpdatesDescription')}</p>
          </div>
          <Switch 
            className="mt-1"
            checked={profile?.email_updates ?? true}
            onCheckedChange={(checked) => onUpdatePreference('email_updates', checked)}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
