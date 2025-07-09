import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Settings, Users, BarChart3, Building2, Shield } from "lucide-react";
import { GlobalMetrics } from "./GlobalMetrics";
import { UserManagement } from "./UserManagement";
import { PropertyOwnerManagement } from "./PropertyOwnerManagement";
import { SystemSettings } from "./SystemSettings";
import { AdminRoles } from "./AdminRoles";

export const AdminContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("metrics");

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile-first responsive tabs */}
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6 sm:mb-8 h-auto mobile-tabs-scroll p-1">
          <TabsTrigger 
            value="metrics" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50"
          >
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('globalMetrics', { fallback: 'Métriques' })}</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50"
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('users', { fallback: 'Utilisateurs' })}</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger 
            value="owners" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50"
          >
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('propertyOwners', { fallback: 'Propriétaires' })}</span>
            <span className="sm:hidden">Props</span>
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('roles', { fallback: 'Rôles' })}</span>
            <span className="sm:hidden">Roles</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50 col-span-2 sm:col-span-1"
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('systemSettings', { fallback: 'Paramètres' })}</span>
            <span className="sm:hidden">Config</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4 sm:space-y-6 animate-fade-in">
          <GlobalMetrics />
        </TabsContent>

        <TabsContent value="users" className="space-y-4 sm:space-y-6 animate-fade-in">
          <UserManagement />
        </TabsContent>

        <TabsContent value="owners" className="space-y-4 sm:space-y-6 animate-fade-in">
          <PropertyOwnerManagement />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4 sm:space-y-6 animate-fade-in">
          <AdminRoles />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 sm:space-y-6 animate-fade-in">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};