
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
  property_id: string | null;
  properties?: {
    name: string;
  };
  firstName?: string;
  lastName?: string;
  fullName?: string;
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
      setIsLoading(true);
      
      // Log l'ID utilisateur pour le débogage
      console.log("Fetching tenant data for user_id:", user?.id);
      
      // D'abord récupérer les données du profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user?.id)
        .maybeSingle();
        
      // Puis récupérer les données du locataire avec la jointure sur properties
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
          property_id,
          properties:property_id(name)
        `)
        .eq('tenant_profile_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching tenant data:", error);
        throw error;
      }

      console.log("Tenant data fetched:", tenant);
      console.log("Properties data structure:", tenant?.properties);

      if (tenant) {
        // Utiliser le nom du profil si disponible, sinon utiliser le nom du locataire
        const displayName = profileData?.first_name && profileData?.last_name 
          ? `${profileData.first_name} ${profileData.last_name}` 
          : tenant.name || user?.user_metadata?.full_name;
        
        // Initialiser le nom de la propriété
        let propertyName = "";
        
        // Déterminer le nom de la propriété de manière sécurisée
        if (tenant.properties) {
          // Si c'est un objet direct
          if (typeof tenant.properties === 'object' && tenant.properties !== null) {
            if ('name' in tenant.properties && typeof tenant.properties.name === 'string') {
              propertyName = tenant.properties.name;
            }
          }
        }

        console.log("Property name extracted:", propertyName); // Ajout pour le débogage
        
        setTenant({
          ...tenant,
          name: displayName,
          firstName: profileData?.first_name || user?.user_metadata?.first_name,
          lastName: profileData?.last_name || user?.user_metadata?.last_name,
          fullName: displayName,
          // Utiliser le format correct pour properties
          properties: { name: propertyName }
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Could not load tenant data",
        variant: "destructive",
      });
    }
  };

  return {
    tenant,
    isLoading,
    fetchTenantData
  };
};
