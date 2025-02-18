
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

  console.log('📊 Dashboard State:', { 
    hasUser: !!user, 
    userId: user?.id,
    isAuthenticated, 
    loading,
    timestamp: new Date().toISOString(),
    currentPath: window.location.pathname
  });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      console.log('👤 Fetching profile data for user:', user?.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      }
      console.log('✅ Profile data fetched:', data);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    retry: false
  });

  useEffect(() => {
    // Si le chargement est terminé et que l'utilisateur n'est pas authentifié
    if (!loading && !isAuthenticated) {
      console.log('🚫 Not authenticated, redirecting to auth');
      navigate("/auth", { replace: true });
      return;
    }

    // Si le profil est chargé et que c'est un tenant
    if (profileData?.is_tenant_user) {
      console.log('👥 Tenant user detected, redirecting to maintenance');
      navigate("/maintenance", { replace: true });
    }
  }, [loading, isAuthenticated, profileData, navigate]);

  // Afficher le loader pendant la vérification initiale
  if (loading || isLoadingProfile) {
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

  // Ne pas afficher le dashboard si non authentifié
  if (!isAuthenticated) {
    return null;
  }

  console.log('🎉 Rendering dashboard content', {
    userId: user?.id,
    isAuthenticated,
    hasProfile: !!profileData
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
