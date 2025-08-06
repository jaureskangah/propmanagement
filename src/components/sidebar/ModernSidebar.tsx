
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
  Building2,
  BarChart3,
  Shield,
  Factory,
  Bell
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSidebarContext } from "@/contexts/SidebarContext";
import "./modernSidebar.css";

export interface ModernSidebarProps {
  isTenant?: boolean;
}

const ModernSidebar = ({ isTenant = false }: ModernSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLocale();
  const { isAdmin } = useAdminRole();
  
  console.log("🔍 ModernSidebar: About to use useSidebarContext");
  const { isMobileOpen, setIsMobileOpen, isMobile } = useSidebarContext();
  console.log("✅ ModernSidebar: Successfully got sidebar context", { isMobile, isMobileOpen });
  
  // Links différents selon le type d'utilisateur
  const links = React.useMemo(() => {
    if (isTenant) {
      return [
        { to: "/tenant/dashboard", icon: LayoutDashboard, label: String(t('dashboard') || 'Dashboard'), section: null },
        { to: "/tenant/dashboard?section=maintenance", icon: Wrench, label: "Maintenance", section: "maintenance" },
        { to: "/tenant/dashboard?section=documents", icon: FileText, label: String(t('documentsLabel') || 'Documents'), section: "documents" },
        { to: "/tenant/dashboard?section=settings", icon: Settings, label: String(t('settings') || 'Settings'), section: "settings" }
      ];
    }
    
    return [
      { to: "/dashboard", icon: LayoutDashboard, label: String(t('dashboard') || 'Dashboard') },
      { to: "/properties", icon: Building, label: String(t('properties') || 'Properties') },
      { to: "/tenants", icon: Users, label: String(t('tenants') || 'Tenants') },
      { to: "/invitations", icon: Mail, label: String(t('invitations') || 'Invitations') },
      { to: "/finances", icon: CreditCard, label: String(t('finances') || 'Finances') },
      { to: "/maintenance", icon: Wrench, label: "Maintenance" },
      { to: "/reminders", icon: Bell, label: "Rappels automatisés" },
      { to: "/reports", icon: BarChart3, label: String(t('reports') || 'Reports') },
      { to: "/production-dashboard", icon: Factory, label: "Production", adminOnly: true },
      { to: "/admin", icon: Shield, label: String(t('admin') || 'Admin'), adminOnly: true },
      { to: "/settings", icon: Settings, label: String(t('settings') || 'Settings') }
    ].filter(link => !link.adminOnly || isAdmin);
  }, [isTenant, t, isAdmin]);

  const isActive = (path: string, section?: string) => {
    if (isTenant && path.startsWith("/tenant/dashboard")) {
      // Pour les liens tenant, vérifier si on est sur la page tenant/dashboard
      if (location.pathname !== "/tenant/dashboard") {
        return false;
      }
      
      // Récupérer la section actuelle depuis l'URL
      const searchParams = new URLSearchParams(location.search);
      const currentSection = searchParams.get('section');
      
      // Si pas de section spécifiée dans le lien, c'est le dashboard principal
      if (!section) {
        return !currentSection || currentSection === 'overview';
      }
      
      // Sinon, vérifier que la section correspond
      return currentSection === section;
    }
    return location.pathname === path;
  };

  const handleSupportClick = () => {
    navigate('/support');
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

  // Desktop sidebar component
  const DesktopSidebar = () => (
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
                isActive(link.to, 'section' in link ? link.section : undefined) && "active"
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
            <span>{String(t('getSupport') || 'Get Support')}</span>
          </div>
        </button>
      </div>
    </aside>
  );

  // Mobile sidebar component
  const MobileSidebar = () => (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 pt-0" data-mobile-sidebar>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3" onClick={handleLogoClick}>
              <Building2 className="h-8 w-8 text-[#ea384c]" />
              <span className="font-bold text-lg">PropManagement</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    "hover:bg-muted",
                    isActive(link.to, 'section' in link ? link.section : undefined) 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Support Button */}
          <div className="p-4 border-t">
            <button 
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground w-full text-left"
              onClick={() => {
                handleSupportClick();
                setIsMobileOpen(false);
              }}
            >
              <HelpCircle className="h-4 w-4" />
              <span>{String(t('getSupport') || 'Get Support')}</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {isMobile ? <MobileSidebar /> : <DesktopSidebar />}
    </>
  );
};

export default ModernSidebar;
