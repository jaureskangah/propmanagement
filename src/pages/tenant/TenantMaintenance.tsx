
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TenantMaintenanceView } from "@/components/tenant/maintenance/TenantMaintenanceView";
import AppSidebar from "@/components/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

const TenantMaintenance = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Activer les notifications en temps réel
  useRealtimeNotifications();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      console.log("Fetching profile for user:", user?.id);
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile data:", data);
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("No authenticated user found");
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    if (!isLoading && profile && !profile.is_tenant_user) {
      console.log("User is not a tenant");
      toast({
        title: "Access Denied",
        description: "This page is only accessible to tenants",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
  }, [user, profile, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please wait while we load your maintenance information...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-3 sm:p-4 md:p-6 space-y-6">
        <TenantMaintenanceView />
      </div>
    </div>
  );
};

export default TenantMaintenance;
