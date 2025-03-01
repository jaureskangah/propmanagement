
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface TenantData {
  id: string;
  name: string;
  email: string;
  unit_number: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  properties?: {
    name: string;
  };
}

export const useTenantData = () => {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTenantData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchTenantData = async () => {
    try {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select(`
          id, 
          name, 
          email, 
          unit_number, 
          lease_start, 
          lease_end, 
          rent_amount,
          properties (name)
        `)
        .eq('tenant_profile_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (tenant) {
        setTenant(tenant);
      } else {
        setIsLoading(false);
        toast({
          title: "Profil non lié",
          description: "Veuillez contacter votre gestionnaire pour lier votre compte.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du locataire",
        variant: "destructive",
      });
    }
  };

  return {
    tenant,
    isLoading,
    setIsLoading,
    fetchTenantData
  };
};
