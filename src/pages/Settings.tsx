
import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { motion } from "framer-motion";
import SettingsPageHeader from "@/components/settings/SettingsPageHeader";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { LanguageSection } from "@/components/settings/LanguageSection";
import { TenantUserCard } from "@/components/settings/TenantUserCard";
import { useProfileData } from "@/hooks/useProfileData";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useThemeSettings } from "@/hooks/useThemeSettings";

const Settings = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile, refetch } = useProfileData();
  const { updatePreference, isLoading: preferencesLoading } = useNotificationPreferences(profile);
  const { theme, mounted, toggleTheme } = useThemeSettings();

  // Check if user is a tenant and redirect appropriately
  const isTenantUser = user?.user_metadata?.is_tenant_user;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={isTenantUser} />
      <div className="ml-20 p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6 max-w-4xl"
        >
          <SettingsPageHeader userEmail={user?.email} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <ProfileSection
                profile={profile}
                isLoading={profileLoading}
                userEmail={user?.email}
                onProfileUpdate={refetch}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <SecuritySection />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <AppearanceSection
                theme={theme}
                onThemeChange={toggleTheme}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <NotificationsSection
                profile={profile}
                isLoading={preferencesLoading}
                onUpdatePreference={updatePreference}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="lg:col-span-2"
            >
              <LanguageSection />
            </motion.div>
          </div>

          {isTenantUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <TenantUserCard />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
