
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
    console.log('Dashboard mount effect:', {
      isAuthenticated,
      loading,
      userId: user?.id
    });

    // Only redirect if we're sure about the authentication state
    if (!loading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to auth page...');
      navigate('/auth');
      return;
    }

    if (!loading && isAuthenticated) {
      console.log('Successfully authenticated, showing dashboard');
    }
  }, [loading, isAuthenticated, navigate, user]);

  // Show loading state
  if (loading) {
    console.log('Dashboard loading state active');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!isAuthenticated) {
    console.log('Dashboard render: Not authenticated');
    return null;
  }

  console.log('Dashboard render: Showing content');
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
