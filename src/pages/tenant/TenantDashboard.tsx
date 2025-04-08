
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { TenantDashboard } from "@/components/tenant/TenantDashboard";
import { useAuth } from '@/components/AuthProvider';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TenantDashboardPage = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    console.log("TenantDashboard page mounted, auth state:", { 
      isAuthenticated, 
      isTenant: user?.user_metadata?.is_tenant_user,
      email: user?.email,
      loading
    });
  }, [isAuthenticated, user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-gray-900">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // Vérifier si l'utilisateur n'est PAS un locataire
  if (user && !user.user_metadata?.is_tenant_user) {
    console.log("User is not a tenant, redirecting to owner dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("Rendering tenant dashboard page");
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <AppSidebar isTenant={true} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className={cn(
        "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TenantDashboard />
        </motion.div>
      </div>
    </div>
  );
};

export default TenantDashboardPage;
