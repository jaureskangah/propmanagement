
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Logging de l'état d'authentification
  useEffect(() => {
    console.log("Dashboard state:", {
      user: !!user,
      isAuthenticated,
      loading,
      userId: user?.id
    });
  }, [user, isAuthenticated, loading]);

  // Protection de route
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Redirecting to auth - Not authenticated");
      navigate("/auth");
      return;
    }
  }, [loading, isAuthenticated, navigate]);

  // Charger les données du profil
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      console.log("Fetching profile data for user:", user?.id);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user?.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile data");
          throw error;
        }

        console.log("Profile data loaded:", data);
        return data;
      } catch (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });

  // Gérer les états de chargement
  if (loading || (!profileData && isLoadingProfile)) {
    console.log("Loading state:", { loading, isLoadingProfile });
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Vérifier l'authentification
  if (!isAuthenticated || !user) {
    console.log("Not authenticated, returning null");
    return null;
  }

  console.log("Rendering dashboard with profile:", profileData);

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
