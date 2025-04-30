
import React, { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { MaintenancePageContainer } from "@/components/maintenance/MaintenancePageContainer";
import { TenantUserContainer } from "@/components/maintenance/TenantUserContainer";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Maintenance = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      {isMobile && (
        <div className="fixed top-2 left-2 z-50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/80 backdrop-blur-sm shadow-sm"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <AppSidebar 
        isTenant={isTenantUser} 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
        isMobileOpen={mobileMenuOpen}
        setIsMobileOpen={setMobileMenuOpen}
      />
      
      <div className={cn(
        "p-3 sm:p-6 md:p-8 pt-16 md:pt-8 transition-all duration-300",
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
