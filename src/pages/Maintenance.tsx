
import React from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { MaintenancePageContainer } from "@/components/maintenance/MaintenancePageContainer";
import { TenantUserContainer } from "@/components/maintenance/TenantUserContainer";

const Maintenance = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <AppSidebar isTenant={isTenantUser} />
      <div className="flex-1 container mx-auto p-3 sm:p-4 md:p-6 font-sans overflow-y-auto">
        {isTenantUser ? (
          <TenantUserContainer />
        ) : (
          <MaintenancePageContainer />
        )}
      </div>
    </div>
  );
};

export default Maintenance;
