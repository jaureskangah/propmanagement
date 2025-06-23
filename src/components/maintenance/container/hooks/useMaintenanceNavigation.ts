
import { useState, useEffect } from "react";
import { BarChart3, AlertCircle, CheckSquare, Users, DollarSign } from "lucide-react";

export const useMaintenanceNavigation = (getCountForTab: (tab: string) => number | undefined) => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('maintenanceActiveTab') || 'overview';
  });
  const [hasError, setHasError] = useState(false);

  // Save active tab to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maintenanceActiveTab', activeTab);
    } catch (error) {
      console.error("MaintenanceNavigation - Error saving active tab:", error);
    }
  }, [activeTab]);

  // Reset error state when tab changes
  useEffect(() => {
    setHasError(false);
  }, [activeTab]);

  const navItems = [
    { 
      name: "Vue d'ensemble", 
      value: "overview", 
      icon: BarChart3,
      count: getCountForTab('overview')
    },
    { 
      name: "Demandes", 
      value: "requests", 
      icon: AlertCircle,
      count: getCountForTab('requests')
    },
    { 
      name: "Tâches", 
      value: "tasks", 
      icon: CheckSquare,
      count: getCountForTab('tasks')
    },
    { 
      name: "Prestataires", 
      value: "vendors", 
      icon: Users,
      count: getCountForTab('vendors')
    },
    { 
      name: "Dépenses", 
      value: "finances", 
      icon: DollarSign,
      count: getCountForTab('finances')
    },
  ];

  return {
    activeTab,
    setActiveTab,
    hasError,
    setHasError,
    navItems
  };
};
