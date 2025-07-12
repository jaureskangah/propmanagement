import React, { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BarChart3, TrendingUp, Building2, Users, Activity } from "lucide-react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { AnalyticsDashboard } from "./analytics/AnalyticsDashboard";
import { FinancialReports } from "./financial/FinancialReports";
import { PropertyReports } from "./property/PropertyReports";
import { TenantReports } from "./tenant/TenantReports";
import { PerformanceMetrics } from "./performance/PerformanceMetrics";

export const ReportsContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("analytics");

  const navItems = [
    {
      name: t('analytics', { fallback: 'Aperçu' }),
      value: "analytics",
      icon: BarChart3,
    },
    {
      name: t('financial', { fallback: 'Financier' }),
      value: "financial",
      icon: TrendingUp,
    },
    {
      name: t('properties', { fallback: 'Propriétés' }),
      value: "properties",
      icon: Building2,
    },
    {
      name: t('tenants', { fallback: 'Locataires' }),
      value: "tenants",
      icon: Users,
    },
    {
      name: t('performance', { fallback: 'Performance' }),
      value: "performance",
      icon: Activity,
    },
  ];

  const renderActiveContent = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "financial":
        return <FinancialReports />;
      case "properties":
        return <PropertyReports />;
      case "tenants":
        return <TenantReports />;
      case "performance":
        return <PerformanceMetrics />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <TubelightNavBar
        items={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {renderActiveContent()}
      </div>
    </div>
  );
};