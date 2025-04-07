
import React from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { MaintenancePageContainer } from "@/components/maintenance/MaintenancePageContainer";
import { TenantUserContainer } from "@/components/maintenance/TenantUserContainer";

const Maintenance = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={isTenantUser} />
      <div className="p-6 md:p-8 pt-24 md:pt-8 md:ml-[270px]">
        <h1 className="text-3xl font-bold mb-8">Maintenance</h1>
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
