
import { LayoutDashboard, Home, Users, Wrench, MessageSquare } from "lucide-react";
import { SidebarNavLink } from "./SidebarNavLink";

interface SidebarLinksProps {
  isTenant: boolean;
  collapsed?: boolean;
}

export const SidebarLinks = ({ isTenant, collapsed }: SidebarLinksProps) => {
  if (!isTenant) {
    return (
      <>
        <SidebarNavLink 
          to="/dashboard" 
          icon={LayoutDashboard} 
          collapsed={collapsed}
          tooltipContent="Dashboard"
        >
          Dashboard
        </SidebarNavLink>
        <SidebarNavLink 
          to="/properties" 
          icon={Home} 
          collapsed={collapsed}
          tooltipContent="Properties"
        >
          Properties
        </SidebarNavLink>
        <SidebarNavLink 
          to="/tenants" 
          icon={Users} 
          collapsed={collapsed}
          tooltipContent="Tenants"
        >
          Tenants
        </SidebarNavLink>
        <SidebarNavLink 
          to="/maintenance" 
          icon={Wrench} 
          collapsed={collapsed}
          tooltipContent="Maintenance"
        >
          Maintenance
        </SidebarNavLink>
      </>
    );
  }

  return (
    <>
      <SidebarNavLink 
        to="/tenant/maintenance" 
        icon={Wrench} 
        collapsed={collapsed}
        tooltipContent="Maintenance"
      >
        Maintenance
      </SidebarNavLink>
      <SidebarNavLink 
        to="/tenant/communications" 
        icon={MessageSquare} 
        collapsed={collapsed}
        tooltipContent="Communications"
      >
        Communications
      </SidebarNavLink>
    </>
  );
};
