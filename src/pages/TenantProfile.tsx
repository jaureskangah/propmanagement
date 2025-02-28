
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { TenantInfoCard } from "@/components/tenant/profile/TenantInfoCard";
import { UnlinkedTenantProfile } from "@/components/tenant/profile/UnlinkedTenantProfile";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";

const TenantProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTenantProfile();
    }
  }, [user]);

  const fetchTenantProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('tenant_profile_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      setTenant(data);
    } catch (error) {
      console.error('Error fetching tenant profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileLinked = () => {
    fetchTenantProfile();
  };

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : tenant ? (
          <TenantInfoCard tenant={tenant} />
        ) : (
          <UnlinkedTenantProfile 
            tenant={{
              id: '',
              name: user?.user_metadata?.full_name || 'Locataire',
              email: user?.email || '',
              phone: '',
              unit_number: '',
              rent_amount: 0,
              lease_start: new Date().toISOString(),
              lease_end: new Date().toISOString(),
              property_id: '',
              communications: [],
              documents: [],
              maintenanceRequests: [],
              paymentHistory: [],
              user_id: user?.id || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              tenant_profile_id: null
            }}
            onProfileLinked={handleProfileLinked}
          />
        )}
      </div>
    </div>
  );
};

export default TenantProfile;
