
import React, { useState, useEffect } from "react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { BarChart3, AlertCircle, CheckSquare, Users, DollarSign } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceOverview } from "./sections/MaintenanceOverview";
import { MaintenanceRequestsSection } from "./sections/MaintenanceRequestsSection";
import { MaintenanceTasksSection } from "./sections/MaintenanceTasksSection";
import { MaintenanceVendorsSection } from "./sections/MaintenanceVendorsSection";
import { MaintenanceFinancesSection } from "./sections/MaintenanceFinancesSection";
import { motion } from "framer-motion";

export const SimplifiedMaintenanceContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('maintenanceActiveTab') || 'overview';
  });

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('maintenanceActiveTab', activeTab);
  }, [activeTab]);

  const navItems = [
    { 
      name: "Vue d'ensemble", 
      value: "overview", 
      icon: BarChart3,
      count: 0 // Will be populated with actual data
    },
    { 
      name: "Demandes", 
      value: "requests", 
      icon: AlertCircle,
      count: 0 // Will be populated with pending requests count
    },
    { 
      name: "Tâches", 
      value: "tasks", 
      icon: CheckSquare,
      count: 0 // Will be populated with active tasks count
    },
    { 
      name: "Prestataires", 
      value: "vendors", 
      icon: Users,
      count: 0 // Will be populated with active vendors count
    },
    { 
      name: "Finances", 
      value: "finances", 
      icon: DollarSign,
      count: 0 // Will be populated with recent expenses count
    },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return <MaintenanceOverview />;
      case 'requests':
        return <MaintenanceRequestsSection />;
      case 'tasks':
        return <MaintenanceTasksSection />;
      case 'vendors':
        return <MaintenanceVendorsSection />;
      case 'finances':
        return <MaintenanceFinancesSection />;
      default:
        return <MaintenanceOverview />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Simple Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t('maintenance')}
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez toutes vos activités de maintenance depuis un seul endroit
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
