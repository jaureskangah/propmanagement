
import React from 'react';
import { Navigate } from 'react-router-dom';
import { TenantDashboard } from "@/components/tenant/TenantDashboard";
import { useAuth } from '@/components/AuthProvider';
import { motion } from "framer-motion";
import AnimatedLayout from "@/components/layout/AnimatedLayout";

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

  // Redirect non-tenants to owner dashboard - SEULEMENT si on est sûr du statut
  if (!isTenant && !loading) {
    console.log("🔄 User is not a tenant, redirecting to owner dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Only tenants should reach this point
  console.log("✅ Rendering tenant dashboard for authenticated tenant");
  return (
    <AnimatedLayout isTenant={true}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-8"
      >
        <TenantDashboard />
      </motion.div>
    </AnimatedLayout>
  );
};

export default TenantDashboardPage;
