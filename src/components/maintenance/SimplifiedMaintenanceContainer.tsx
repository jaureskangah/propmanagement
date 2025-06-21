
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

  // Fetch maintenance requests
  const { data: maintenanceRequests = [] } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching maintenance requests:", error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch maintenance tasks
  const { data: maintenanceTasks = [] } = useQuery({
    queryKey: ['maintenance_tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching maintenance tasks:", error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch vendors
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching vendors:", error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch maintenance expenses (last 30 days)
  const { data: maintenanceExpenses = [] } = useQuery({
    queryKey: ['maintenance_expenses'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('maintenance_expenses')
        .select('*')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error fetching maintenance expenses:", error);
        return [];
      }
      return data || [];
    },
  });

  // Calculate dynamic counts based on real data
  const dynamicCounts = useMemo(() => {
    // Overview count: Total maintenance requests
    const overviewCount = maintenanceRequests.length;
    
    // Requests count: Pending requests
    const requestsCount = maintenanceRequests.filter(req => 
      req.status === 'Pending' || req.status === 'pending'
    ).length;
    
    // Tasks count: Incomplete tasks
    const tasksCount = maintenanceTasks.filter(task => 
      !task.completed && task.status !== 'completed'
    ).length;
    
    // Vendors count: Total active vendors
    const vendorsCount = vendors.length;
    
    // Finances count: Recent expenses (last 30 days)
    const financesCount = maintenanceExpenses.length;

    return {
      overview: overviewCount,
      requests: requestsCount,
      tasks: tasksCount,
      vendors: vendorsCount,
      finances: financesCount
    };
  }, [maintenanceRequests, maintenanceTasks, vendors, maintenanceExpenses]);

  // Function to get contextual count for active tab
  const getCountForTab = (tabValue: string) => {
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
