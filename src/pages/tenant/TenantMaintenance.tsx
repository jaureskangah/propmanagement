import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TenantMaintenanceView } from "@/components/tenant/maintenance/TenantMaintenanceView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

const TenantMaintenance = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLocale();
  
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
        title: t('authenticationRequired'),
        description: t('pleaseSignIn'),
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    if (!isLoading && profile && !profile.is_tenant_user) {
      console.log("User is not a tenant");
      toast({
        title: t('accessDenied'),
        description: t('tenantsOnly'),
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
  }, [user, profile, isLoading, navigate, toast, t]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('loading')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('loadingMaintenanceInfo')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ResponsiveLayout title={t('maintenance')} className="p-3 sm:p-4 md:p-6" isTenant={true}>
        <div className="space-y-6">
          <TenantMaintenanceView />
        </div>
    </ResponsiveLayout>
  );
};

export default TenantMaintenance;
