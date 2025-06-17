
import React, { useState, useEffect } from "react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { BarChart3, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DashboardOverview } from "./sections/DashboardOverview";
import { DashboardPriorities } from "./sections/DashboardPriorities";
import { DashboardRevenue } from "./sections/DashboardRevenue";
import { DashboardActivities } from "./sections/DashboardActivities";
import { motion } from "framer-motion";
import { DateRange } from "./DashboardDateFilter";

interface SimplifiedDashboardContainerProps {
  dateRange: DateRange;
  propertiesData: any[];
  maintenanceData: any[];
  tenantsData: any[];
  paymentsData: any[];
}

export const SimplifiedDashboardContainer = ({ 
  dateRange, 
  propertiesData, 
  maintenanceData, 
  tenantsData, 
  paymentsData 
}: SimplifiedDashboardContainerProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboardActiveTab') || 'overview';
  });

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', activeTab);
  }, [activeTab]);

  const navItems = [
    { 
      name: t('overview'), 
      value: "overview", 
      icon: BarChart3,
      count: 0 // Will be populated with actual data
    },
    { 
      name: t('priorities'), 
      value: "priorities", 
      icon: AlertCircle,
      count: 0 // Will be populated with urgent items count
    },
    { 
      name: t('revenue'), 
      value: "revenue", 
      icon: TrendingUp,
      count: 0 // Will be populated with revenue insights count
    },
    { 
      name: t('activities'), 
      value: "activities", 
      icon: Activity,
      count: 0 // Will be populated with recent activities count
    },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview 
            dateRange={dateRange}
            propertiesData={propertiesData}
            maintenanceData={maintenanceData}
            tenantsData={tenantsData}
          />
        );
      case 'priorities':
        return (
          <DashboardPriorities 
            maintenanceData={maintenanceData}
            tenantsData={tenantsData}
            paymentsData={paymentsData}
          />
        );
      case 'revenue':
        return <DashboardRevenue />;
      case 'activities':
        return <DashboardActivities />;
      default:
        return (
          <DashboardOverview 
            dateRange={dateRange}
            propertiesData={propertiesData}
            maintenanceData={maintenanceData}
            tenantsData={tenantsData}
          />
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Simple Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t('dashboard')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('dashboardDescription', { fallback: 'Vue d\'ensemble de votre activité immobilière' })}
        </p>
      </div>

      {/* TubelightNavBar */}
      <TubelightNavBar
        items={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      {/* Active Section Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[500px]"
      >
        {renderActiveSection()}
      </motion.div>
    </div>
  );
};
