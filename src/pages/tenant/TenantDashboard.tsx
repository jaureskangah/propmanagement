
import React from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { TenantDashboard } from "@/components/tenant/TenantDashboard";
import { useAuth } from '@/components/AuthProvider';
import { motion } from "framer-motion";

const TenantDashboardPage = () => {
  const { isAuthenticated, loading, isTenant } = useAuth();

  React.useEffect(() => {
    console.log("=== TENANT DASHBOARD ===");
    console.log("TenantDashboard component mounted, auth state:", { 
      isAuthenticated, 
      isTenant,
      loading 
    });
  }, [isAuthenticated, isTenant, loading]);

  // Show loading spinner while checking auth
  if (loading) {
    console.log("TenantDashboard showing loading spinner");
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // Redirect non-tenants to owner dashboard
  if (!isTenant && !loading) {
    console.log("🔄 User is not a tenant, redirecting to owner dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ Rendering tenant dashboard for authenticated tenant");
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={true} />
      <main className="ml-20 pt-16 md:pt-8 transition-all duration-300">
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
