
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
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Add this effect to ensure theme is available after component mount
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Log the current theme state for debugging
  useEffect(() => {
    if (mounted) {
      console.log("Current theme in Settings page:", theme);
    }
  }, [theme, mounted]);

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

  if (!mounted) {
    // Return placeholder UI if theme is not yet available
    return (
      <div className="min-h-screen bg-background">
        <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
        <div className={cn(
          "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
          sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
        )}>
          <div className="container max-w-5xl mx-auto animate-pulse">
            <div className="h-10 w-64 bg-muted rounded-md mb-8"></div>
            <div className="space-y-8">
              <div className="h-48 bg-muted rounded-lg"></div>
              <div className="h-48 bg-muted rounded-lg"></div>
              <div className="h-48 bg-muted rounded-lg"></div>
              <div className="h-48 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className={cn(
        "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
        <div className="container max-w-5xl mx-auto">
          <SettingsPageHeader userEmail={user?.email} />

          <div className="space-y-8 pb-16">
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
              onThemeChange={(checked) => {
                console.log("Settings page changing theme to:", checked ? "dark" : "light");
                setTheme(checked ? "dark" : "light");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
