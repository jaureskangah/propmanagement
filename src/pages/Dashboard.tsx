
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

  // Simplified route protection
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No active session found, redirecting to auth');
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate("/auth", { replace: true });
      }
    };

    if (!loading && !isAuthenticated) {
      checkAuth();
    }
  }, [loading, isAuthenticated, navigate]);

  // Profile data query with better error handling
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID available");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load profile data");
        throw error;
      }

      return data;
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error("Profile query error:", error);
        toast.error("Error loading profile data");
      }
    }
  });

  // Show loading state only when necessary
  const isInitialLoading = loading || (isAuthenticated && !profileData && isLoadingProfile);
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Early return if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Render dashboard
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
