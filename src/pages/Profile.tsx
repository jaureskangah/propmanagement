import React, { useState } from 'react';
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from '@/components/AuthProvider';
import { cn } from "@/lib/utils";
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { useLocale } from "@/components/providers/LocaleProvider";

const Profile = () => {
  const { t } = useLocale();
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <AppSidebar isTenant={isTenantUser} />
      <ResponsiveLayout title={t('profile')} className="p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Profile Page</h1>
        {/* Contenu du profil */}
      </ResponsiveLayout>
    </>
  );
};

export default Profile;
