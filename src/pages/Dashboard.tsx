
import React from 'react';
import AppSidebar from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <DashboardHeader title="Dashboard" />
          <DashboardContent 
            isLoading={false} 
            metrics={{}}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
