
import React from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { SimplifiedMaintenanceContainer } from "@/components/maintenance/SimplifiedMaintenanceContainer";
import { TenantUserContainer } from "@/components/maintenance/TenantUserContainer";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/sidebar/ModernSidebar";

const MaintenanceContent = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  const { open } = useSidebar();
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "flex-1 p-3 sm:p-6 md:p-8 pt-16 md:pt-8 transition-all duration-300",
      // Synchronize margin with sidebar state - use 'open' instead of separate state
      !isMobile && (open ? "md:ml-[270px]" : "md:ml-[80px]")
    )}>
      {isTenantUser ? (
        <TenantUserContainer />
      ) : (
        <SimplifiedMaintenanceContainer />
      )}
    </div>
  );
};

const Maintenance = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  
  return (
    <div className="min-h-screen bg-background flex w-full">
      <AppSidebar isTenant={isTenantUser} />
      <MaintenanceContent />
    </div>
  );
};

export default Maintenance;
