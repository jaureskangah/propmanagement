
import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { SimplifiedMaintenanceContainer } from "@/components/maintenance/SimplifiedMaintenanceContainer";
import { TenantUserContainer } from "@/components/maintenance/TenantUserContainer";

const Maintenance = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  
  return (
    <div className="p-4 md:p-6">
      {isTenantUser ? (
        <TenantUserContainer />
      ) : (
        <SimplifiedMaintenanceContainer />
      )}
    </div>
  );
};

export default Maintenance;
