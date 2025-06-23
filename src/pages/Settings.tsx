
import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { motion } from "framer-motion";
import SettingsPageHeader from "@/components/settings/SettingsPageHeader";
import { ProfileFormSection } from "@/components/settings/ProfileFormSection";
import { TenantUserCard } from "@/components/settings/TenantUserCard";
import { useSettingsData } from "@/hooks/useSettingsData";

const Settings = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { profile, setProfile, isLoading, handleSave } = useSettingsData();

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

          <ProfileFormSection
            profile={profile}
            onProfileChange={setProfile}
            onSave={handleSave}
            isLoading={isLoading}
            isTenantUser={isTenantUser}
          />

          {isTenantUser && <TenantUserCard />}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
