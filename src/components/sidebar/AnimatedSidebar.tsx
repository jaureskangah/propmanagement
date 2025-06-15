
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronLeft } from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import SidebarLinks from "./SidebarLinks";

interface AnimatedSidebarProps {
  isTenant?: boolean;
}

const AnimatedSidebar = ({ isTenant = false }: AnimatedSidebarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLocale();
  const location = useLocation();

  const handleSupportClick = () => {
    window.open('mailto:contact@propmanagement.app', '_blank');
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-screen bg-sidebar-background border-r transition-all duration-500 ease-in-out overflow-hidden",
        isHovered ? "w-[270px]" : "w-[80px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex h-[60px] items-center border-b px-6 relative">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <SidebarLogo isCollapsed={!isHovered} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 relative">
        <AnimatedSidebarLinks 
          isTenant={isTenant} 
          isExpanded={isHovered}
        />
      </nav>

      {/* Footer */}
      <div className="border-t p-4 relative">
        <Button 
          variant="outline" 
          className={cn(
            "w-full justify-start gap-2 transition-all duration-300 relative overflow-hidden",
            !isHovered && "w-10 h-10 p-0 justify-center"
          )}
          onClick={handleSupportClick}
        >
          <HelpCircle className="h-4 w-4 flex-shrink-0" />
          <span 
            className={cn(
              "transition-all duration-300 whitespace-nowrap",
              isHovered 
                ? "opacity-100 transform translate-x-0" 
                : "opacity-0 transform translate-x-4 absolute"
            )}
            style={{
              transitionDelay: isHovered ? '200ms' : '0ms'
            }}
          >
            {t('getSupport')}
          </span>
        </Button>
      </div>
    </aside>
  );
};

// Composant pour les liens avec animations progressives
interface AnimatedSidebarLinksProps {
  isTenant: boolean;
  isExpanded: boolean;
}

const AnimatedSidebarLinks = ({ isTenant, isExpanded }: AnimatedSidebarLinksProps) => {
  const location = useLocation();
  const { t } = useLocale();
  
  // Links différents selon le type d'utilisateur
  const links = React.useMemo(() => {
    if (isTenant) {
      return [
        { to: "/tenant/dashboard", icon: require("lucide-react").LayoutDashboard, label: t('dashboard') },
        { to: "/tenant/maintenance", icon: require("lucide-react").Wrench, label: t('maintenance') },
        { to: "/tenant/documents", icon: require("lucide-react").FileText, label: "Documents" },
        { to: "/settings", icon: require("lucide-react").Settings, label: t('settings') }
      ];
    }
    
    return [
      { to: "/dashboard", icon: require("lucide-react").LayoutDashboard, label: t('dashboard') },
      { to: "/properties", icon: require("lucide-react").Building, label: t('properties') },
      { to: "/tenants", icon: require("lucide-react").Users, label: t('tenants') },
      { to: "/invitations", icon: require("lucide-react").Mail, label: t('invitations') },
      { to: "/finances", icon: require("lucide-react").CreditCard, label: t('finances') },
      { to: "/maintenance", icon: require("lucide-react").Wrench, label: t('maintenance') },
      { to: "/settings", icon: require("lucide-react").Settings, label: t('settings') }
    ];
  }, [isTenant, t]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="space-y-2">
      {links.map((link, index) => {
        const Icon = link.icon;
        const active = isActive(link.to);
        
        return (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 hover:bg-muted relative overflow-hidden",
              active ? "bg-muted font-medium" : "",
              !isExpanded && "justify-center px-2"
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span 
              className={cn(
                "transition-all duration-300 whitespace-nowrap",
                isExpanded 
                  ? "opacity-100 transform translate-x-0" 
                  : "opacity-0 transform translate-x-4 absolute"
              )}
              style={{
                transitionDelay: isExpanded ? `${50 + index * 30}ms` : '0ms'
              }}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default AnimatedSidebar;
