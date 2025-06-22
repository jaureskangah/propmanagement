import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Building,
  Users,
  FileText,
  Wrench,
  CreditCard,
  Mail
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { SidebarLink } from "./ModernSidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

export interface SidebarLinksProps {
  isTenant?: boolean;
  tooltipEnabled?: boolean;
  collapsed?: boolean;
  renderAsModernLinks?: boolean;
}

const SidebarLinks = ({ 
  isTenant = false, 
  tooltipEnabled = true, 
  collapsed = false,
  renderAsModernLinks = false
}: SidebarLinksProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLocale();
  
  // Links différents selon le type d'utilisateur
  const links = React.useMemo(() => {
    if (isTenant) {
      // Menu limité pour les locataires
      return [
        { to: "/tenant/dashboard", icon: LayoutDashboard, label: t('dashboard'), tooltip: t('dashboard') },
        { to: "/tenant/maintenance", icon: Wrench, label: t('maintenance'), tooltip: t('maintenance') },
        { to: "/tenant/documents", icon: FileText, label: t('documents'), tooltip: t('documents') },
        { to: "/settings", icon: Settings, label: t('settings'), tooltip: t('settings') }
      ];
    }
    
    // Menu complet pour les propriétaires
    return [
      { to: "/dashboard", icon: LayoutDashboard, label: t('dashboard'), tooltip: t('dashboard') },
      { to: "/properties", icon: Building, label: t('properties'), tooltip: t('properties') },
      { to: "/tenants", icon: Users, label: t('tenants'), tooltip: t('tenants') },
      { to: "/invitations", icon: Mail, label: t('invitations'), tooltip: t('invitations') },
      { to: "/finances", icon: CreditCard, label: t('finances'), tooltip: t('finances') },
      { to: "/maintenance", icon: Wrench, label: t('maintenance'), tooltip: t('maintenance') },
      { to: "/settings", icon: Settings, label: t('settings'), tooltip: t('settings') }
    ];
  }, [isTenant, t]);

  const isActive = (path: string) => location.pathname === path;

  // Render modern sidebar links
  if (renderAsModernLinks) {
    return (
      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <SidebarLink
              key={link.to}
              icon={<Icon className="h-5 w-5" />}
              isActive={isActive(link.to)}
              onClick={() => navigate(link.to)}
            >
              {link.label}
            </SidebarLink>
          );
        })}
      </div>
    );
  }
  
  // Keep existing legacy implementation for backward compatibility
  if (!tooltipEnabled) {
    return (
      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted w-full text-left ${
                isActive(link.to) ? "bg-muted font-medium" : ""
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
  
  // For tooltips, wrap the entire component with TooltipProvider
  return (
    <TooltipProvider>
      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Tooltip key={link.to}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate(link.to)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted w-full text-left ${
                    isActive(link.to) ? "bg-muted font-medium" : ""
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span>{link.label}</span>}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{link.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default SidebarLinks;
