
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
    timestamp: new Date().toISOString()
  });

  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = useQuery({
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
    enabled: isAuthenticated && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: false, // Désactivation des retries
    refetchOnMount: false, // Désactivation du refetch au montage
    refetchOnWindowFocus: false // Désactivation du refetch au focus
  });

  // Effet combiné pour la gestion de l'authentification et des redirections
  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié et que le chargement est terminé
    if (!isAuthenticated && !loading) {
      console.log('🔒 User not authenticated, redirecting to login');
      navigate("/auth", { replace: true });
      return;
    }

    // Si l'utilisateur est un tenant et que les données du profil sont chargées
    if (isAuthenticated && !loading && profileData?.is_tenant_user) {
      console.log('🏠 Redirecting tenant to maintenance page');
      navigate("/maintenance", { replace: true });
    }
  }, [isAuthenticated, loading, profileData, navigate]);

  // Affichage du loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Vérification de l'authentification...</span>
      </div>
    );
  }

  // Affichage du loader pendant le chargement du profil
  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement du profil...</span>
      </div>
    );
  }

  // Gestion des erreurs
  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Une erreur est survenue lors du chargement du profil.</p>
      </div>
    );
  }

  // Si non authentifié après le chargement, ne rien afficher (la redirection sera gérée par l'effet)
  if (!isAuthenticated) {
    return null;
  }

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
