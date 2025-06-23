
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Building,
  Users,
  FileText,
  Wrench,
  CreditCard,
  Mail,
  HelpCircle,
  Building2
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import "./modernSidebar.css";

export interface ModernSidebarProps {
  isTenant?: boolean;
}

const ModernSidebar = ({ isTenant = false }: ModernSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLocale();
  
  // Links différents selon le type d'utilisateur
  const links = React.useMemo(() => {
    if (isTenant) {
      return [
        { to: "/tenant/dashboard", icon: LayoutDashboard, label: t('dashboard') },
        { to: "/tenant/maintenance", icon: Wrench, label: t('maintenance') },
        { to: "/tenant/documents", icon: FileText, label: t('documents') },
        { to: "/settings", icon: Settings, label: t('settings') }
      ];
    }
    
    return [
      { to: "/dashboard", icon: LayoutDashboard, label: t('dashboard') },
      { to: "/properties", icon: Building, label: t('properties') },
      { to: "/tenants", icon: Users, label: t('tenants') },
      { to: "/invitations", icon: Mail, label: t('invitations') },
      { to: "/finances", icon: CreditCard, label: t('finances') },
      { to: "/maintenance", icon: Wrench, label: t('maintenance') },
      { to: "/settings", icon: Settings, label: t('settings') }
    ];
  }, [isTenant, t]);

  const isActive = (path: string) => location.pathname === path;

  const handleSupportClick = () => {
    window.open('mailto:contact@propmanagement.app', '_blank');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/';
    }
  };

  return (
    <aside className="modern-sidebar">
      {/* Logo Section */}
      <div className="modern-sidebar-logo" onClick={handleLogoClick}>
        <div className="logo-icon">
          <Building2 className="h-8 w-8 text-[#ea384c]" />
        </div>
        <div className="logo-text">
          <span>PropManagement</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="modern-sidebar-nav">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "modern-sidebar-item",
                isActive(link.to) && "active"
              )}
              style={{ '--item-index': index } as React.CSSProperties}
            >
              <div className="item-icon">
                <Icon className="h-5 w-5" />
              </div>
              <div className="item-text">
                <span>{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Support Button */}
      <div className="modern-sidebar-footer">
        <button 
          className="modern-sidebar-item support-button"
          onClick={handleSupportClick}
        >
          <div className="item-icon">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div className="item-text">
            <span>{t('getSupport')}</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default ModernSidebar;
