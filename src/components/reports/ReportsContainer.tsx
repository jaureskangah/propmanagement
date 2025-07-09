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
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('analytics', { fallback: 'Analytics' })}
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('financial', { fallback: 'Financier' })}
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {t('properties', { fallback: 'Propriétés' })}
          </TabsTrigger>
          <TabsTrigger value="tenants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('tenants', { fallback: 'Locataires' })}
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('performance', { fallback: 'Performance' })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <PropertyReports />
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          <TenantReports />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};