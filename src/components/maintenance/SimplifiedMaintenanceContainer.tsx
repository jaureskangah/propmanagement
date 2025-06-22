
import React, { useState, useEffect, useMemo } from "react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { BarChart3, AlertCircle, CheckSquare, Users, DollarSign } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceOverview } from "./sections/MaintenanceOverview";
import { MaintenanceRequestsSection } from "./sections/MaintenanceRequestsSection";
import { MaintenanceTasksSection } from "./sections/MaintenanceTasksSection";
import { MaintenanceVendorsSection } from "./sections/MaintenanceVendorsSection";
import { MaintenanceFinancesSection } from "./sections/MaintenanceFinancesSection";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const SimplifiedMaintenanceContainer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('maintenanceActiveTab') || 'overview';
  });

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('maintenanceActiveTab', activeTab);
  }, [activeTab]);

  // Fetch maintenance requests with error handling
  const { data: maintenanceRequests = [] } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("SimplifiedMaintenanceContainer - Error fetching maintenance requests:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("SimplifiedMaintenanceContainer - Exception fetching maintenance requests:", error);
        return [];
      }
    },
    retry: false,
  });

  // Fetch maintenance tasks with error handling
  const { data: maintenanceTasks = [] } = useQuery({
    queryKey: ['maintenance_tasks'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_tasks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("SimplifiedMaintenanceContainer - Error fetching maintenance tasks:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("SimplifiedMaintenanceContainer - Exception fetching maintenance tasks:", error);
        return [];
      }
    },
    retry: false,
  });

  // Fetch vendors with error handling
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("SimplifiedMaintenanceContainer - Error fetching vendors:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("SimplifiedMaintenanceContainer - Exception fetching vendors:", error);
        return [];
      }
    },
    retry: false,
  });

  // Fetch maintenance expenses with error handling
  const { data: maintenanceExpenses = [] } = useQuery({
    queryKey: ['maintenance_expenses'],
    queryFn: async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data, error } = await supabase
          .from('maintenance_expenses')
          .select('*')
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: false });
        
        if (error) {
          console.error("SimplifiedMaintenanceContainer - Error fetching maintenance expenses:", error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error("SimplifiedMaintenanceContainer - Exception fetching maintenance expenses:", error);
        return [];
      }
    },
    retry: false,
  });

  // Calculate dynamic counts based on real data with safe fallbacks
  const dynamicCounts = useMemo(() => {
    try {
      const overviewCount = Array.isArray(maintenanceRequests) ? maintenanceRequests.length : 0;
      
      const requestsCount = Array.isArray(maintenanceRequests) 
        ? maintenanceRequests.filter(req => req?.status === 'Pending' || req?.status === 'pending').length 
        : 0;
      
      const tasksCount = Array.isArray(maintenanceTasks) 
        ? maintenanceTasks.filter(task => !task?.completed && task?.status !== 'completed').length 
        : 0;
      
      const vendorsCount = Array.isArray(vendors) ? vendors.length : 0;
      
      const financesCount = Array.isArray(maintenanceExpenses) ? maintenanceExpenses.length : 0;

      return {
        overview: overviewCount,
        requests: requestsCount,
        tasks: tasksCount,
        vendors: vendorsCount,
        finances: financesCount
      };
    } catch (error) {
      console.error("SimplifiedMaintenanceContainer - Error calculating counts:", error);
      return {
        overview: 0,
        requests: 0,
        tasks: 0,
        vendors: 0,
        finances: 0
      };
    }
  }, [maintenanceRequests, maintenanceTasks, vendors, maintenanceExpenses]);

  // Function to get contextual count for active tab
  const getCountForTab = (tabValue: string) => {
    try {
      switch (tabValue) {
        case 'overview':
          return dynamicCounts.overview;
        case 'requests':
          return dynamicCounts.requests;
        case 'tasks':
          return dynamicCounts.tasks;
        case 'vendors':
          return dynamicCounts.vendors;
        case 'finances':
          return dynamicCounts.finances;
        default:
          return undefined;
      }
    } catch (error) {
      console.error("SimplifiedMaintenanceContainer - Error getting count for tab:", tabValue, error);
      return 0;
    }
  };

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
      name: "Finances", 
      value: "finances", 
      icon: DollarSign,
      count: getCountForTab('finances')
    },
  ];

  const renderActiveSection = () => {
    try {
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
    } catch (error) {
      console.error("SimplifiedMaintenanceContainer - Error rendering section:", activeTab, error);
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Erreur lors du chargement de la section.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Recharger la page
          </button>
        </div>
      );
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
