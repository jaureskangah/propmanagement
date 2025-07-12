import React, { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Settings, Users, BarChart3, Building2, Shield } from "lucide-react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { GlobalMetrics } from "./GlobalMetrics";
import { UserManagement } from "./UserManagement";
import { PropertyOwnerManagement } from "./PropertyOwnerManagement";
import { SystemSettings } from "./SystemSettings";
import { AdminRoles } from "./AdminRoles";

export const AdminContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("metrics");

  const navItems = [
    {
      name: t('globalMetrics', { fallback: 'Métriques' }),
      value: "metrics",
      icon: BarChart3,
    },
    {
      name: t('users', { fallback: 'Utilisateurs' }),
      value: "users",
      icon: Users,
    },
    {
      name: t('propertyOwners', { fallback: 'Propriétaires' }),
      value: "owners",
      icon: Building2,
    },
    {
      name: t('roles', { fallback: 'Rôles' }),
      value: "roles",
      icon: Shield,
    },
    {
      name: t('systemSettings', { fallback: 'Paramètres' }),
      value: "settings",
      icon: Settings,
    },
  ];

  const renderActiveContent = () => {
    switch (activeTab) {
      case "metrics":
        return <GlobalMetrics />;
      case "users":
        return <UserManagement />;
      case "owners":
        return <PropertyOwnerManagement />;
      case "roles":
        return <AdminRoles />;
      case "settings":
        return <SystemSettings />;
      default:
        return <GlobalMetrics />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-scale-in">
        <TubelightNavBar
          items={navItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <div key={activeTab} className="animate-fade-in">
          {renderActiveContent()}
        </div>
      </div>
    </div>
  );
};