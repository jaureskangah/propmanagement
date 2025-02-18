
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import type { DateRange } from "@/components/dashboard/DashboardDateFilter";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  console.log('🔍 Dashboard Render:', { 
    hasUser: !!user, 
    userId: user?.id,
    isAuthenticated, 
    loading,
    timestamp: new Date().toISOString(),
    currentPath: window.location.pathname,
    sessionState: supabase.auth.session,
  });

  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      console.log('👤 Fetching profile data for user:', user?.id);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user?.id)
          .single();
        
        if (error) {
          console.error('❌ Error fetching profile:', error);
          throw error;
        }
        
        console.log('✅ Profile data fetched:', data);
        return data;
      } catch (error) {
        console.error('💥 Profile fetch failed:', error);
        return null;
      }
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });

  // Log every effect execution
  useEffect(() => {
    console.log('⚡️ Auth Effect triggered:', {
      loading,
      isAuthenticated,
      hasProfile: !!profileData,
      userId: user?.id,
      timestamp: new Date().toISOString()
    });

    if (!loading) {
      if (!isAuthenticated) {
        console.log('🚫 Redirecting to auth - Not authenticated');
        navigate("/auth", { replace: true });
        return;
      }

      if (profileData?.is_tenant_user) {
        console.log('👥 Redirecting to maintenance - Tenant user');
        navigate("/maintenance", { replace: true });
      }
    }
  }, [loading, isAuthenticated, profileData, navigate, user?.id]);

  if (loading || isLoadingProfile) {
    console.log('⏳ Loading state:', { loading, isLoadingProfile });
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-gray-500">
            {loading ? "Vérification de l'authentification..." : "Chargement du profil..."}
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 Not rendering - User not authenticated');
    return null;
  }

  if (profileError) {
    console.error('❌ Profile error:', profileError);
    return null;
  }

  console.log('🎉 Rendering dashboard:', {
    userId: user?.id,
    isAuthenticated,
    hasProfile: !!profileData,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 space-y-6 p-8 font-sans">
        <DashboardHeader 
          title="Dashboard" 
          trend={{
            value: 0,
            label: "vs last month"
          }}
        />
        <DashboardContent
          dateRange={{
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          }}
          onDateRangeChange={() => {}}
          propertiesData={[]}
          maintenanceData={[]}
          tenantsData={[]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
