
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

  // Protéger la route du dashboard immédiatement si pas authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🚫 Non authentifié, redirection vers /auth');
      navigate("/auth", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('👤 Fetching profile data for user:', user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error('❌ Error fetching profile:', error);
        throw error;
      }
      
      console.log('✅ Profile data fetched:', data);
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });

  // Afficher le loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-gray-500">
            Vérification de l'authentification...
          </span>
        </div>
      </div>
    );
  }

  // Rediriger si non authentifié
  if (!isAuthenticated) {
    return null; // Le useEffect s'occupera de la redirection
  }

  // Afficher le loader pendant le chargement du profil
  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-gray-500">
            Chargement du profil...
          </span>
        </div>
      </div>
    );
  }

  // Gérer l'erreur de profil
  if (profileError) {
    console.error('❌ Profile error:', profileError);
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Une erreur est survenue lors du chargement du profil.
      </div>
    );
  }

  // Rediriger les utilisateurs locataires vers la page maintenance
  if (profileData?.is_tenant_user) {
    console.log('👥 Redirecting to maintenance - Tenant user');
    navigate("/maintenance", { replace: true });
    return null;
  }

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
