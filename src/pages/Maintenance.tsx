
import React from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { SimplifiedMaintenanceContainer } from "@/components/maintenance/SimplifiedMaintenanceContainer";
import { TenantUserContainer } from "@/components/maintenance/TenantUserContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { useLocale } from "@/components/providers/LocaleProvider";

const Maintenance = () => {
  const { t } = useLocale();
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  const isMobile = useIsMobile();
  
  return (
    <>
      <AppSidebar isTenant={isTenantUser} />
      <ResponsiveLayout title={t('maintenance')} className="p-4 md:p-6">
        {isTenantUser ? (
          <TenantUserContainer />
        ) : (
          <SimplifiedMaintenanceContainer />
        )}
      </ResponsiveLayout>
    </>
  );
};

export default Maintenance;
