
import { useAuth } from "@/components/AuthProvider";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Lock, User, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { EditProfileDialog } from "@/components/settings/EditProfileDialog";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t } = useLocale();

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const updateNotificationPreference = async (type: 'push_notifications' | 'email_updates', value: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [type]: value })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: t('preferencesUpdated'),
        description: t('preferencesUpdatedMessage')
      });

      refetch();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('preferencesUpdateError'),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-8 pb-16">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{t('settings')}</h1>
          </div>

          <div className="grid gap-6">
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('profile')}
                </CardTitle>
                <CardDescription>
                  {t('profileDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">{t('firstName')}</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.first_name || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">{t('lastName')}</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.last_name || '-'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{t('email')}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="flex justify-end">
                      <EditProfileDialog
                        initialData={{
                          first_name: profile?.first_name || '',
                          last_name: profile?.last_name || '',
                        }}
                        onProfileUpdate={refetch}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {t('security')}
                </CardTitle>
                <CardDescription>
                  {t('securityDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordDialog />
              </CardContent>
            </Card>

            {/* Notifications */}
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
                    onCheckedChange={(checked) => updateNotificationPreference('push_notifications', checked)}
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
                    onCheckedChange={(checked) => updateNotificationPreference('email_updates', checked)}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  {t('appearance')}
                </CardTitle>
                <CardDescription>
                  {t('appearanceDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{t('darkTheme')}</p>
                    <p className="text-sm text-muted-foreground">{t('darkThemeDescription')}</p>
                  </div>
                  <Switch 
                    checked={theme === "dark"} 
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
