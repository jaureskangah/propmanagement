
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
    <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 opacity-50" />
      <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-orange-400 to-amber-500" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <Bell className="h-5 w-5" />
          </div>
          {t('notifications')}
        </CardTitle>
        <CardDescription className="text-sm opacity-75">
          {t('notificationsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4 pb-6">
        <div className="flex justify-between items-center rounded-lg bg-white/60 p-4 shadow-sm">
          <div>
            <p className="font-medium text-slate-800">{t('pushNotifications')}</p>
            <p className="text-sm text-slate-600">{t('pushNotificationsDescription')}</p>
          </div>
          <Switch 
            className="data-[state=checked]:bg-orange-500"
            checked={profile?.push_notifications ?? true}
            onCheckedChange={(checked) => onUpdatePreference('push_notifications', checked)}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-between items-center rounded-lg bg-white/60 p-4 shadow-sm">
          <div>
            <p className="font-medium text-slate-800">{t('emailUpdates')}</p>
            <p className="text-sm text-slate-600">{t('emailUpdatesDescription')}</p>
          </div>
          <Switch 
            className="data-[state=checked]:bg-orange-500"
            checked={profile?.email_updates ?? true}
            onCheckedChange={(checked) => onUpdatePreference('email_updates', checked)}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
