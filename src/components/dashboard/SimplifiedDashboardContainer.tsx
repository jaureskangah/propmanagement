
import React, { useState, useEffect, useMemo } from "react";
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

  // Calculate dynamic counts based on real data
  const dynamicCounts = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Overview count: Total active properties
    const overviewCount = Array.isArray(propertiesData) ? propertiesData.length : 0;
    
    // Priorities count: Urgent maintenance + high priority items
    const urgentMaintenance = Array.isArray(maintenanceData) ? 
      maintenanceData.filter(item => 
        item.priority === 'Urgent' || 
        item.priority === 'urgent' || 
        item.priority === 'Emergency' ||
        (item.status === 'Pending' || item.status === 'pending')
      ).length : 0;
    
    // Revenue count: Recent payments (last 30 days) as indicator of financial activity
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentPayments = Array.isArray(paymentsData) ? 
      paymentsData.filter(payment => {
        const paymentDate = new Date(payment.payment_date || payment.created_at);
        return paymentDate >= thirtyDaysAgo;
      }).length : 0;
    
    // Activities count: Recent activities (last 7 days)
    const recentActivities = (() => {
      let count = 0;
      
      // Recent tenants
      if (Array.isArray(tenantsData)) {
        count += tenantsData.filter(tenant => {
          const createdAt = new Date(tenant.created_at);
          return createdAt >= sevenDaysAgo;
        }).length;
      }
      
      // Recent maintenance
      if (Array.isArray(maintenanceData)) {
        count += maintenanceData.filter(item => {
          const createdAt = new Date(item.created_at);
          return createdAt >= sevenDaysAgo;
        }).length;
      }
      
      // Recent payments
      if (Array.isArray(paymentsData)) {
        count += paymentsData.filter(payment => {
          const paymentDate = new Date(payment.payment_date || payment.created_at);
          return paymentDate >= sevenDaysAgo;
        }).length;
      }
      
      return count;
    })();

    return {
      overview: overviewCount,
      priorities: urgentMaintenance,
      revenue: recentPayments,
      activities: recentActivities
    };
  }, [propertiesData, maintenanceData, tenantsData, paymentsData]);

  const navItems = [
    { 
      name: t('overview'), 
      value: "overview", 
      icon: BarChart3,
      count: dynamicCounts.overview
    },
    { 
      name: t('priorities'), 
      value: "priorities", 
      icon: AlertCircle,
      count: dynamicCounts.priorities
    },
    { 
      name: t('revenue'), 
      value: "revenue", 
      icon: TrendingUp,
      count: dynamicCounts.revenue
    },
    { 
      name: t('activities'), 
      value: "activities", 
      icon: Activity,
      count: dynamicCounts.activities
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
