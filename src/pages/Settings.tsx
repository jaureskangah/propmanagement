
import { useAuth } from "@/components/AuthProvider";
import AppSidebar from "@/components/AppSidebar";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { LanguageSection } from "@/components/settings/LanguageSection";
import { Settings as SettingsIcon } from "lucide-react";

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
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-5xl space-y-6 p-8 pb-16">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <SettingsIcon className="h-6 w-6 text-slate-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">{t('settings')}</h1>
          </div>

          <div className="grid gap-8 pt-4 md:grid-cols-2">
            <div className="space-y-8">
              <ProfileSection
                profile={profile}
                isLoading={isLoading}
                userEmail={user?.email}
                onProfileUpdate={refetch}
              />
              
              <NotificationsSection
                profile={profile}
                isLoading={isLoading}
                onUpdatePreference={updateNotificationPreference}
              />
              
              <LanguageSection />
            </div>

            <div className="space-y-8">
              <SecuritySection />
              
              <AppearanceSection
                theme={theme}
                onThemeChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
