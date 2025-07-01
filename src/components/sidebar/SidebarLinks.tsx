
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  Building,
  Calendar,
  File,
  CreditCard,
  MessageSquare,
  Mail,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarLinksProps {
  isTenant?: boolean;
  collapsed?: boolean;
  tooltipEnabled?: boolean;
}

export const SidebarLinks = ({ isTenant = false, collapsed = false, tooltipEnabled = false }: SidebarLinksProps) => {
  const { t } = useLocale();

  const navigationItems = [
    {
      title: t('dashboard'),
      icon: Home,
      href: '/',
      badge: null,
    },
    {
      title: t('properties'),
      icon: Building,
      href: '/properties',
      badge: null,
    },
    {
      title: t('tenants'),
      icon: Users,
      href: '/tenants',
      badge: null,
    },
    {
      title: t('maintenanceRequests'),
      icon: MessageSquare,
      href: '/maintenance-requests',
      badge: null,
    },
    {
      title: t('leases'),
      icon: File,
      href: '/leases',
      badge: null,
    },
    {
      title: t('payments'),
      icon: CreditCard,
      href: '/payments',
      badge: null,
    },
    {
      title: t('rentReminders'),
      icon: Mail,
      href: '/rent-reminders',
      badge: null,
    },
    {
      title: t('calendar'),
      icon: Calendar,
      href: '/calendar',
      badge: null,
    },
    {
      title: t('settings'),
      icon: Settings,
      href: '/settings',
      badge: null,
    },
  ];

  if (isTenant) {
    return null;
  }

  return (
    <>
      {navigationItems.map((item) => (
        <Link
          key={item.title}
          to={item.href}
          className={cn(
            "flex items-center space-x-2 text-sm font-medium hover:text-accent-foreground p-2 rounded-md hover:bg-accent",
            collapsed && "justify-center"
          )}
        >
          <item.icon className="h-4 w-4" />
          {!collapsed && (
            <>
              <span>{item.title}</span>
              {item.badge && (
                <span className="ml-auto rounded-sm bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Link>
      ))}
    </>
  );
};
