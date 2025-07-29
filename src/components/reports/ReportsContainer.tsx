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
      name: t('analytics', { fallback: 'Analytics' }),
      value: "analytics",
      icon: BarChart3,
    },
    {
      name: t('financial', { fallback: 'Financial' }),
      value: "financial",
      icon: TrendingUp,
    },
    {
      name: t('properties', { fallback: 'Properties' }),
      value: "properties",
      icon: Building2,
    },
    {
      name: t('tenants', { fallback: 'Tenants' }),
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
