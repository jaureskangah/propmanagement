
import React from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { TenantDashboard } from "@/components/tenant/TenantDashboard";
import { useAuth } from '@/components/AuthProvider';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TenantDashboardPage = () => {
  const { isAuthenticated, loading, isTenant } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect non-tenants to owner dashboard - THIS IS CRITICAL
  if (!isTenant) {
    console.log("User is not a tenant, redirecting to owner dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Only tenants should reach this point
  console.log("Rendering tenant dashboard for authenticated tenant");
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={true} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <main className={cn(
        "pt-16 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pb-8"
        >
          <TenantDashboard />
        </motion.div>
      </main>
    </div>
  );
};

export default TenantDashboardPage;
