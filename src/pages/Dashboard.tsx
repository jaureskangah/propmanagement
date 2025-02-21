
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

  // Journalisation de l'état initial
  useEffect(() => {
    console.log('Dashboard mounted with state:', { 
      userId: user?.id,
      isAuthenticated,
      loading
    });

    // Cleanup function
    return () => {
      console.log('Dashboard unmounting');
    };
  }, [user?.id, isAuthenticated, loading]);

  // Protection de route avec une seule redirection
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('Non authentifié, redirection unique vers /auth');
      navigate("/auth", { replace: true }); // Using replace to avoid history stack
    }
  }, [loading, isAuthenticated]);

  // Attendre que l'authentification soit vérifiée
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Arrêter le rendu si non authentifié
  if (!isAuthenticated || !user) {
    return null;
  }

  // Charger les données du profil uniquement si authentifié
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: isAuthenticated && !!user.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false // Ne pas réessayer en cas d'erreur
  });

  // Attendre le chargement du profil
  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirection des utilisateurs locataires
  if (profileData?.is_tenant_user) {
    navigate("/maintenance", { replace: true });
    return null;
  }

  // Rendu du dashboard
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
