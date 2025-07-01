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

export const SidebarLinks = () => {
  const { t } = useLocale();
  const { isTenant } = useAuth();

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
      href: '/maintenance',
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
        <a
          key={item.title}
          href={item.href}
          className="flex items-center space-x-2 text-sm font-medium hover:text-accent-foreground"
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
          {item.badge && (
            <span className="ml-auto rounded-sm bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {item.badge}
            </span>
          )}
        </a>
      ))}
    </>
  );
};
