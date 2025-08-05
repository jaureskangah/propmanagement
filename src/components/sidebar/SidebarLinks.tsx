
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Building,
  Users,
  FileText,
  MessageSquare,
  Wrench,
  CreditCard,
  Mail,
  BarChart3,
  Factory
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAdminRole } from "@/hooks/useAdminRole";
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
}

const SidebarLinks = ({ isTenant = false, tooltipEnabled = true, collapsed = false }: SidebarLinksProps) => {
  const location = useLocation();
  const { t } = useLocale();
  const { isAdmin } = useAdminRole();
  
  // Links différents selon le type d'utilisateur
  const links = React.useMemo(() => {
    if (isTenant) {
      // Menu pour les locataires - tous pointent vers /tenant/dashboard avec des sections
      return [
        { to: "/tenant/dashboard", icon: LayoutDashboard, label: t('dashboard'), tooltip: t('dashboard'), section: null },
        { to: "/tenant/dashboard?section=maintenance", icon: Wrench, label: t('maintenance'), tooltip: t('maintenance'), section: "maintenance" },
        { to: "/tenant/dashboard?section=documents", icon: FileText, label: t('documents'), tooltip: t('documents'), section: "documents" },
        { to: "/tenant/dashboard?section=settings", icon: Settings, label: t('settings'), tooltip: t('settings'), section: "settings" }
      ];
    }
    
    // Menu complet pour les propriétaires
    const baseLinks = [
      { to: "/dashboard", icon: LayoutDashboard, label: t('dashboard'), tooltip: t('dashboard') },
      { to: "/properties", icon: Building, label: t('properties'), tooltip: t('properties') },
      { to: "/tenants", icon: Users, label: t('tenants'), tooltip: t('tenants') },
      { to: "/invitations", icon: Mail, label: t('invitations'), tooltip: t('invitations') },
      { to: "/finances", icon: CreditCard, label: t('finances'), tooltip: t('finances') },
      { to: "/maintenance", icon: Wrench, label: t('maintenance'), tooltip: t('maintenance') },
      { to: "/reports", icon: BarChart3, label: t('reports'), tooltip: t('reports') },
      { to: "/settings", icon: Settings, label: t('settings'), tooltip: t('settings') }
    ];
    
    // Ajouter le lien Production uniquement pour les admins
    if (isAdmin) {
      baseLinks.splice(-1, 0, { to: "/production-dashboard", icon: Factory, label: "Production", tooltip: "Production Dashboard" });
    }
    
    return baseLinks;
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
                isActive(link.to, 'section' in link ? link.section : undefined) ? "bg-muted font-medium" : ""
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
  
  // For tooltips, wrap the entire component with TooltipProvider
  return (
    <TooltipProvider>
      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Tooltip key={link.to}>
              <TooltipTrigger asChild>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted ${
                    isActive(link.to, 'section' in link ? link.section : undefined) ? "bg-muted font-medium" : ""
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
    </TooltipProvider>
  );
};

export default SidebarLinks;
