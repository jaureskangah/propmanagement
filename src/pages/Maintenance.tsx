
import React, { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { SimplifiedMaintenanceContainer } from "@/components/maintenance/SimplifiedMaintenanceContainer";
import { TenantUserContainer } from "@/components/maintenance/TenantUserContainer";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/sidebar/ModernSidebar";

const Maintenance = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background flex w-full">
      <AppSidebar 
        isTenant={isTenantUser} 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
        isMobileOpen={mobileMenuOpen}
        setIsMobileOpen={setMobileMenuOpen}
      />
      
      <div className={cn(
        "flex-1 p-3 sm:p-6 md:p-8 pt-16 md:pt-8 transition-all duration-300",
        sidebarCollapsed || isMobile ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
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
