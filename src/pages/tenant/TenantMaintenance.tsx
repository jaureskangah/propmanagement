import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TenantMaintenanceView } from "@/components/tenant/maintenance/TenantMaintenanceView";
import AppSidebar from "@/components/AppSidebar";

const TenantMaintenance = () => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenantId();
  }, []);

  const fetchTenantId = async () => {
    try {
      console.log("Fetching tenant ID...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found");
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      console.log("Checking if user is a tenant...");
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_tenant_user')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Error fetching profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to verify tenant status",
          variant: "destructive",
        });
        return;
      }

      if (!profile.is_tenant_user) {
        console.log("User is not a tenant");
        toast({
          title: "Access Denied",
          description: "This page is only accessible to tenants",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      console.log("Fetching tenant data for user:", user.id);
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      if (tenantError) {
        console.error('Error fetching tenant:', tenantError);
        toast({
          title: "Error",
          description: "Failed to load tenant information",
          variant: "destructive",
        });
        return;
      }

      if (!tenant) {
        console.log("No tenant profile found for user:", user.id);
        toast({
          title: "Profile Not Found",
          description: "No tenant profile found for your account",
          variant: "destructive",
        });
        return;
      }

      console.log("Tenant found:", tenant.id);
      setTenantId(tenant.id);
    } catch (error) {
      console.error('Error in fetchTenantId:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Maintenance</h1>
        </div>

        {tenantId ? (
          <TenantMaintenanceView />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default TenantMaintenance;