
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
import SettingsPageHeader from "@/components/settings/SettingsPageHeader";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="flex min-h-screen bg-background">
      <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className="flex-1 overflow-y-auto pt-20 md:pt-0">
        <div className="container p-4 pb-16 max-w-5xl mx-auto">
          <SettingsPageHeader userEmail={user?.email} />

          <div className="space-y-8">
            <ProfileSection
              profile={profile}
              isLoading={isLoading}
              userEmail={user?.email}
              onProfileUpdate={refetch}
            />

            <SecuritySection />

            <LanguageSection />

            <NotificationsSection
              profile={profile}
              isLoading={isLoading}
              onUpdatePreference={updateNotificationPreference}
            />

            <AppearanceSection
              theme={theme}
              onThemeChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
