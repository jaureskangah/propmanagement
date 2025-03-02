
import React from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useAuth } from '@/components/AuthProvider';

const Dashboard = () => {
  const { isAuthenticated, loading, user } = useAuth();

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
  
  // Vérifier si l'utilisateur est un locataire
  if (user?.user_metadata?.is_tenant_user) {
    // Rediriger vers le tableau de bord du locataire
    return <Navigate to="/tenant/dashboard" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <DashboardHeader title="Dashboard" />
          <DashboardContent isLoading={false} metrics={{}} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
