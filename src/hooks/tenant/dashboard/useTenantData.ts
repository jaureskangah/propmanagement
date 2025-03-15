
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
        
        // Extraire correctement les données de propriété et assurer le bon format
        let propertyData: { name: string } = { name: "" };
        
        if (Array.isArray(tenant.properties)) {
          // Si c'est un tableau, prendre le premier élément s'il existe
          if (tenant.properties.length > 0) {
            const firstProperty = tenant.properties[0];
            propertyData = { 
              name: firstProperty && typeof firstProperty === 'object' && 'name' in firstProperty 
                ? String(firstProperty.name || "") 
                : "" 
            };
          }
        } else if (tenant.properties && typeof tenant.properties === 'object') {
          // Si c'est déjà un objet, l'utiliser directement
          propertyData = { 
            name: 'name' in tenant.properties ? String(tenant.properties.name || "") : "" 
          };
        }
        
        setTenant({
          ...tenant,
          name: displayName,
          firstName: profileData?.first_name || user?.user_metadata?.first_name,
          lastName: profileData?.last_name || user?.user_metadata?.last_name,
          fullName: displayName,
          // Utiliser le format correct pour properties
          properties: propertyData
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
