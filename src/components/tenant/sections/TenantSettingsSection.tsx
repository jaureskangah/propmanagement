
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { LanguageSection } from "@/components/settings/LanguageSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/components/AuthProvider";
import { useProfileData } from "@/hooks/useProfileData";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";

interface TenantSettingsSectionProps {
  tenant: TenantData;
  onSettingsUpdate: () => void;
}

export const TenantSettingsSection = ({
  tenant,
  onSettingsUpdate
}: TenantSettingsSectionProps) => {
  const { t } = useLocale();
  const { user } = useAuth();
  const { profile, isLoading: profileLoading, refetch: refetchProfile } = useProfileData();
  const { isLoading: notificationLoading, updatePreference } = useNotificationPreferences(profile);
  const { theme, toggleTheme } = useThemeSettings();

  const handleProfileUpdate = () => {
    refetchProfile();
    onSettingsUpdate();
  };

  const handlePreferenceUpdate = async (type: 'push_notifications' | 'email_updates', value: boolean) => {
    await updatePreference(type, value);
    onSettingsUpdate();
  };

  const handleThemeChange = (isDark: boolean) => {
    toggleTheme(isDark);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('settings')}</h2>
            <p className="text-gray-600">{t('profileDescription')}</p>
          </div>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile')}</CardTitle>
              <CardDescription>{t('profileDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSection 
                profile={profile}
                isLoading={profileLoading}
                userEmail={user?.email}
                onProfileUpdate={handleProfileUpdate}
              />
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('language')}</CardTitle>
              <CardDescription>{t('languageDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSection />
            </CardContent>
          </Card>

          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('appearance')}</CardTitle>
              <CardDescription>{t('appearanceDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSection 
                theme={theme}
                onThemeChange={handleThemeChange}
              />
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('notifications')}</CardTitle>
              <CardDescription>{t('notificationsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationsSection 
                profile={profile}
                isLoading={notificationLoading}
                onUpdatePreference={handlePreferenceUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
