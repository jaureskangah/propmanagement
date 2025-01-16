import { useState } from "react";
import { cn } from "@/lib/utils";
import { Building2, Home, Users, Wrench, MessageSquare } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarToggle } from "./sidebar/SidebarToggle";
import { SidebarNavLink } from "./sidebar/SidebarNavLink";

interface AppSidebarProps {
  isTenant?: boolean;
}

const AppSidebar = ({ isTenant = false }: AppSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative min-h-screen border-r px-4 py-8 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64",
      "bg-background"
    )}>
      <SidebarToggle 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      <SidebarLogo isCollapsed={isCollapsed} />

      <nav className="space-y-2">
        {isTenant ? (
          <>
            <SidebarNavLink 
              to="/tenant/maintenance" 
              icon={Wrench} 
              label="Maintenance" 
              isCollapsed={isCollapsed} 
            />
            <SidebarNavLink 
              to="/tenant/communications" 
              icon={MessageSquare} 
              label="Communications" 
              isCollapsed={isCollapsed} 
            />
          </>
        ) : (
          <>
            <SidebarNavLink 
              to="/dashboard" 
              icon={Home} 
              label="Dashboard" 
              isCollapsed={isCollapsed} 
            />
            <SidebarNavLink 
              to="/properties" 
              icon={Building2} 
              label="Properties" 
              isCollapsed={isCollapsed} 
            />
            <SidebarNavLink 
              to="/tenants" 
              icon={Users} 
              label="Tenants" 
              isCollapsed={isCollapsed} 
            />
            <SidebarNavLink 
              to="/maintenance" 
              icon={Wrench} 
              label="Maintenance" 
              isCollapsed={isCollapsed} 
            />
          </>
        )}
      </nav>

      <div className={cn(
        "absolute bottom-4",
        isCollapsed ? "left-1/2 -translate-x-1/2" : "left-4"
      )}>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default AppSidebar;