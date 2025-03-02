
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { TenantDashboard } from "@/components/tenant/TenantDashboard";
import { useAuth } from '@/components/AuthProvider';

const TenantDashboardPage = () => {
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("User authentication in TenantDashboard:", { 
        authenticated: isAuthenticated,
        isTenant: user?.user_metadata?.is_tenant_user,
        email: user?.email
      });
    }
  }, [user, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar isTenant={true} />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <TenantDashboard />
        </div>
      </div>
    </div>
  );
};

export default TenantDashboardPage;
