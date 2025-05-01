
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Settings,
  Building,
  Users,
  FileText,
  MessageSquare,
  Wrench,
  CreditCard
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SidebarLinksProps {
  isTenant?: boolean;
  tooltipEnabled?: boolean;
  collapsed?: boolean; // Add the collapsed prop
}

const SidebarLinks = ({ isTenant = false, tooltipEnabled = true, collapsed = false }: SidebarLinksProps) => {
  const location = useLocation();
  const { t } = useLocale();
  
  // Using links as a memo to prevent recreation on each render
  const links = React.useMemo(() => {
    if (isTenant) {
      return [
        { to: "/tenant/dashboard", icon: LayoutDashboard, label: t('dashboard'), tooltip: t('dashboard') },
        { to: "/tenant/maintenance", icon: Wrench, label: t('maintenance'), tooltip: t('maintenance') },
        { to: "/tenant/documents", icon: FileText, label: t('documents'), tooltip: t('documents') },
        { to: "/settings", icon: Settings, label: t('settings'), tooltip: t('settings') }
      ];
    }
    
    return [
      { to: "/dashboard", icon: LayoutDashboard, label: t('dashboard'), tooltip: t('dashboard') },
      { to: "/properties", icon: Building, label: t('properties'), tooltip: t('properties') },
      { to: "/tenants", icon: Users, label: t('tenants'), tooltip: t('tenants') },
      { to: "/finances", icon: CreditCard, label: t('finances'), tooltip: t('finances') },
      { to: "/maintenance", icon: Wrench, label: t('maintenance'), tooltip: t('maintenance') },
      { to: "/document-generator", icon: FileText, label: t('documents'), tooltip: t('documents') },
      { to: "/", icon: Home, label: t('home'), tooltip: t('returnToHome') },
      { to: "/settings", icon: Settings, label: t('settings'), tooltip: t('settings') }
    ];
  }, [isTenant, t]);

  // Simplified render function to improve memory usage
  const isActive = (path: string) => location.pathname === path;
  
  // Don't wrap with tooltips when not needed
  if (!tooltipEnabled) {
    return (
      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted ${
                isActive(link.to) ? "bg-muted font-medium" : ""
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Tooltip key={link.to}>
            <TooltipTrigger asChild>
              <Link
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted ${
                  isActive(link.to) ? "bg-muted font-medium" : ""
                } ${collapsed ? "justify-center px-2" : ""}`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{link.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default SidebarLinks;
