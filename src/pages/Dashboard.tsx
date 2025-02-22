
import React from 'react';
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import AppSidebar from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const fetchDashboardData = async () => {
  const { data, error } = await supabase
    .from('dashboard_metrics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error) throw error;
  return data[0] || {};
};

const Dashboard = () => {
  const { data: metrics = {}, isLoading } = useQuery({
    queryKey: ['dashboard_metrics'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <DashboardHeader />
          <DashboardContent isLoading={isLoading} metrics={metrics} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
