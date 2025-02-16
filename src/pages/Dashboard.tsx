
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

  console.log('📊 Dashboard Mount:', { 
    hasUser: !!user, 
    isAuthenticated, 
    loading,
    timestamp: new Date().toISOString()
  });

  // Temporairement commenté pour permettre l'accès sans authentification
  /*
  useEffect(() => {
    console.log('🔒 Auth check effect:', { 
      isAuthenticated, 
      timestamp: new Date().toISOString() 
    });

    if (!loading && !isAuthenticated) {
      console.log('🚫 User not authenticated, redirecting to home');
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  */

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      console.log('👤 Fetching profile data for user:', user?.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error fetching profile:', error);
        throw error;
      }
      console.log('✅ Profile data fetched:', data);
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profileData?.is_tenant_user) {
      console.log('🏠 Redirecting tenant to maintenance page');
      navigate("/maintenance", { replace: true });
    }
  }, [profileData, navigate]);

  // Supprimé la vérification de loading pour permettre l'affichage direct
  /*
  if (loading) {
    console.log('⌛ Dashboard loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, rendering null');
    return null;
  }
  */

  // Supprimé la vérification du profil pour permettre l'affichage direct
  /*
  if (isLoadingProfile) {
    console.log('👤 Loading profile...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  */

  console.log('🎉 Rendering dashboard content');
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
