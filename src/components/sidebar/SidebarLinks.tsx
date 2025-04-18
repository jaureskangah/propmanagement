import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  Building2,
  Users,
  Wrench,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  MessageCircle,
  DollarSign,
  FileText
} from "lucide-react";

interface SidebarLinksProps {
  isTenant?: boolean;
  collapsed?: boolean;
}

export default function SidebarLinks({ isTenant = false, collapsed = false }: SidebarLinksProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLocale();
  const isAdmin = user?.email?.endsWith('@propmanagement.app');
  
  // Liens pour les locataires
  const tenantLinks = [
    {
      href: "/tenant/dashboard",
      icon: LayoutDashboard,
      label: t('dashboard'),
    },
    {
      href: "/tenant/maintenance",
      icon: Wrench,
      label: t('maintenance'),
    },
    {
      href: "/tenant/communications",
      icon: MessageCircle,
      label: t('communications'),
    },
    {
      href: "/tenant/documents",
      icon: FileText,
      label: t('documents'),
    },
    {
      href: "/settings",
      icon: Settings,
      label: t('settings'),
    },
  ];

  // Liens pour les propriétaires
  const ownerLinks = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: t('dashboard'),
    },
    {
      href: "/properties",
      icon: Building2,
      label: t('properties'),
    },
    {
      href: "/tenants",
      icon: Users,
      label: t('tenants'),
    },
    {
      href: "/maintenance",
      icon: Wrench,
      label: t('maintenance'),
    },
    {
      href: "/finances",
      icon: DollarSign,
      label: t('finances'),
    },
    {
      href: "/settings",
      icon: Settings,
      label: t('settings'),
    },
  ];

  // Déterminer les liens à afficher en fonction du rôle de l'utilisateur
  const links = user?.user_metadata?.is_tenant_user || isTenant 
    ? tenantLinks 
    : ownerLinks;

  // Ajouter le lien Admin si l'utilisateur est un admin
  if (isAdmin) {
    links.push({
      href: "/admin",
      icon: ShieldCheck,
      label: t('admin'),
    });
  }

  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors duration-150",
            location.pathname === link.href
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <link.icon
            className={cn(
              "mr-3 h-5 w-5",
              location.pathname === link.href
                ? "text-gray-500"
                : "text-gray-400 group-hover:text-gray-500"
            )}
          />
          {!collapsed && (
            <span className="truncate">{link.label}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}
