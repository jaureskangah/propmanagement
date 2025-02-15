
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  HomeIcon,
  Building2,
  Users,
  Wrench,
  Settings,
  LayoutDashboard
} from "lucide-react";

interface SidebarLinksProps {
  isTenant?: boolean;
  collapsed?: boolean;
}

export default function SidebarLinks({ isTenant = false, collapsed = false }: SidebarLinksProps) {
  const location = useLocation();
  const { user } = useAuthSession();
  const isAdmin = user?.email?.endsWith('@propmanagement.app');

  const links = [
    {
      href: "/",
      icon: HomeIcon,
      label: "Accueil",
    },
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/properties",
      icon: Building2,
      label: "Propriétés",
    },
    {
      href: "/tenants",
      icon: Users,
      label: "Locataires",
    },
    {
      href: "/maintenance",
      icon: Wrench,
      label: "Maintenance",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Paramètres",
    },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    links.push({
      href: "/admin",
      icon: LayoutDashboard,
      label: "Admin",
    });
  }

  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
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
          {!collapsed && link.label}
        </Link>
      ))}
    </nav>
  );
}
