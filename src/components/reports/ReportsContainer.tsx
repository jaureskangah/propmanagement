import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BarChart3, TrendingUp, Building2, Users, Activity } from "lucide-react";
import { AnalyticsDashboard } from "./analytics/AnalyticsDashboard";
import { FinancialReports } from "./financial/FinancialReports";
import { PropertyReports } from "./property/PropertyReports";
import { TenantReports } from "./tenant/TenantReports";
import { PerformanceMetrics } from "./performance/PerformanceMetrics";

export const ReportsContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile-first responsive tabs */}
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6 sm:mb-8 h-auto mobile-tabs-scroll p-1">
          <TabsTrigger 
            value="analytics" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50"
          >
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('analytics', { fallback: 'Analytics' })}</span>
            <span className="sm:hidden">Data</span>
          </TabsTrigger>
          <TabsTrigger 
            value="financial" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50"
          >
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('financial', { fallback: 'Financier' })}</span>
            <span className="sm:hidden">€</span>
          </TabsTrigger>
          <TabsTrigger 
            value="properties" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50"
          >
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('properties', { fallback: 'Propriétés' })}</span>
            <span className="sm:hidden">Biens</span>
          </TabsTrigger>
          <TabsTrigger 
            value="tenants" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50"
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('tenants', { fallback: 'Locataires' })}</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:bg-accent/50 col-span-2 sm:col-span-1"
          >
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('performance', { fallback: 'Performance' })}</span>
            <span className="sm:hidden">Perf</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6 animate-fade-in">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 sm:space-y-6 animate-fade-in">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="properties" className="space-y-4 sm:space-y-6 animate-fade-in">
          <PropertyReports />
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4 sm:space-y-6 animate-fade-in">
          <TenantReports />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 sm:space-y-6 animate-fade-in">
          <PerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};