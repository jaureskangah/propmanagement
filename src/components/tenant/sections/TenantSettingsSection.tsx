
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { LanguageSection } from "@/components/settings/LanguageSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { useLocale } from "@/components/providers/LocaleProvider";
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
            <p className="text-gray-600">Gérez vos préférences et informations personnelles</p>
          </div>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSection />
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card>
            <CardHeader>
              <CardTitle>Langue</CardTitle>
              <CardDescription>Choisissez votre langue préférée</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSection />
            </CardContent>
          </Card>

          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>Personnalisez l'apparence de l'interface</CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSection />
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationsSection />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
