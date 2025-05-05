
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export interface TenantData {
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
  } | null;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

// Interface pour la structure de données des propriétés
interface PropertyObject {
  name: string;
  [key: string]: any;
}

export const useTenantData = () => {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLocale();

  useEffect(() => {
    if (user) {
      fetchTenantData();
    } else {
      setIsLoading(false);
    }
  }, [user, language]); // Réagir aux changements de langue

  const fetchTenantData = async () => {
    try {
      setIsLoading(true);
      
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
      
      if (tenant) {
        console.log("Raw properties data structure:", JSON.stringify(tenant.properties));
      
        // Utiliser le nom du profil si disponible, sinon utiliser le nom du locataire
        const displayName = profileData?.first_name && profileData?.last_name 
          ? `${profileData.first_name} ${profileData.last_name}` 
          : tenant.name || user?.user_metadata?.full_name;
        
        // Traitement amélioré des données de propriété
        let propertyData = null;
        
        if (tenant.properties !== null && tenant.properties !== undefined) {
          console.log("Properties data type:", typeof tenant.properties);
          
          if (typeof tenant.properties === 'object') {
            // Cas 1: properties est un objet direct avec une propriété name
            if (!Array.isArray(tenant.properties)) {
              const props = tenant.properties as PropertyObject;
              if (props && 'name' in props) {
                propertyData = { name: props.name };
              }
            } 
            // Cas 2: properties est un tableau d'objets
            else if (Array.isArray(tenant.properties) && tenant.properties.length > 0) {
              const firstProperty = tenant.properties[0] as PropertyObject;
              if (firstProperty && 'name' in firstProperty) {
                propertyData = { name: firstProperty.name };
              }
            }
          } else if (typeof tenant.properties === 'string') {
            // Cas 3: properties peut être une chaîne simple
            propertyData = { name: tenant.properties };
          }
        }
        
        console.log("Processed property data:", propertyData);
        
        setTenant({
          ...tenant,
          name: displayName,
          firstName: profileData?.first_name || user?.user_metadata?.first_name,
          lastName: profileData?.last_name || user?.user_metadata?.last_name,
          fullName: displayName,
          properties: propertyData
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setIsLoading(false);
      toast({
        title: t('error'),
        description: t('errorLoadingTenantData'),
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
