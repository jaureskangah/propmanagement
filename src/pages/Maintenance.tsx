
import React, { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { MaintenancePageContainer } from "@/components/maintenance/MaintenancePageContainer";
import { TenantUserContainer } from "@/components/maintenance/TenantUserContainer";
import { cn } from "@/lib/utils";

const Maintenance = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={isTenantUser} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className={cn(
        "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
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
