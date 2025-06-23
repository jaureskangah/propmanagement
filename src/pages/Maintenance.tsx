
import React from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { SimplifiedMaintenanceContainer } from "@/components/maintenance/SimplifiedMaintenanceContainer";
import { TenantUserContainer } from "@/components/maintenance/TenantUserContainer";
import { useIsMobile } from "@/hooks/use-mobile";

const Maintenance = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={isTenantUser} />
      
      <div className="ml-20 p-4 md:p-6 pt-24 md:pt-8 transition-all duration-300">
        {isTenantUser ? (
          <TenantUserContainer />
        ) : (
          <SimplifiedMaintenanceContainer />
        )}
      </div>
    </div>
  );
};

export default Maintenance;
