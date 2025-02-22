
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useAuth } from '@/components/AuthProvider';

const Dashboard = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard Auth State:', { isAuthenticated, loading, userId: user?.id });
    
    if (!loading && !isAuthenticated) {
      console.log('Redirecting to auth page...');
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate, user]);

  if (loading) {
    console.log('Dashboard is loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User is not authenticated, rendering null');
    return null;
  }

  console.log('Rendering Dashboard content');
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
