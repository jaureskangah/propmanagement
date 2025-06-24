
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatDate, formatCurrency } from "@/lib/utils";

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

export const useTenantData = () => {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { user, isTenant } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLocale();

  useEffect(() => {
    if (!user) {
      setTenant(null);
      setIsLoading(false);
      return;
    }

    // Si l'utilisateur n'est pas un locataire, on arrête ici
    if (!isTenant) {
      console.log("User is not a tenant, clearing tenant data");
      setTenant(null);
      setIsLoading(false);
      return;
    }

    // Toujours récupérer les données fraîches depuis la base de données
    fetchTenantData();
  }, [user?.id, isTenant]);

  const fetchTenantData = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("=== FETCHING TENANT DATA WITH JOIN ===");
      console.log("User ID:", user.id);
      console.log("User email:", user.email);
      
      setIsLoading(true);
      setHasError(false);

      // Récupérer les données du profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, is_tenant_user')
        .eq('id', user.id)
        .maybeSingle();
        
      console.log("Profile data:", profileData);
      
      // Vérifier que l'utilisateur est bien un locataire
      if (!profileData?.is_tenant_user) {
        console.log("User is not a tenant user");
        setTenant(null);
        setIsLoading(false);
        return;
      }
      
      // REQUÊTE UNIQUE avec JOIN pour récupérer tenant ET propriété
      const { data: tenantWithProperty, error: tenantError } = await supabase
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
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      console.log("=== TENANT WITH PROPERTY QUERY RESULT ===");
      console.log("Data:", tenantWithProperty);
      console.log("Error:", tenantError);

      if (tenantError) {
        console.error("Error fetching tenant data:", tenantError);
        setHasError(true);
        setTenant(null);
        return;
      }

      if (!tenantWithProperty) {
        console.log("No tenant data found for user:", user.id);
        setTenant(null);
        
        toast({
          title: "Profil locataire non trouvé",
          description: "Aucun profil locataire n'a été trouvé pour votre compte. Contactez votre gestionnaire.",
          variant: "destructive",
        });
        return;
      }

      // Construire le nom d'affichage
      const displayName = profileData?.first_name && profileData?.last_name 
        ? `${profileData.first_name} ${profileData.last_name}` 
        : tenantWithProperty.name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
      
      // Traiter les données de propriété correctement
      let propertyData: { name: string } | null = null;
      if (tenantWithProperty.properties) {
        // Si c'est un tableau, prendre le premier élément
        if (Array.isArray(tenantWithProperty.properties)) {
          const firstProperty = tenantWithProperty.properties[0];
          if (firstProperty && typeof firstProperty === 'object' && 'name' in firstProperty) {
            propertyData = { name: String(firstProperty.name) };
          }
        } else if (typeof tenantWithProperty.properties === 'object' && 'name' in tenantWithProperty.properties) {
          // Si c'est déjà un objet avec une propriété name
          propertyData = { name: String(tenantWithProperty.properties.name) };
        }
      }
      
      // Construire l'objet final directement à partir du résultat JOIN
      const finalTenantData: TenantData = {
        ...tenantWithProperty,
        name: displayName,
        firstName: profileData?.first_name || user?.user_metadata?.first_name,
        lastName: profileData?.last_name || user?.user_metadata?.last_name,
        fullName: displayName,
        // Utiliser les données de propriété traitées
        properties: propertyData
      };

      console.log("=== FINAL TENANT DATA WITH JOIN ===");
      console.log("Tenant ID:", finalTenantData.id);
      console.log("Property ID:", finalTenantData.property_id);
      console.log("Properties object:", finalTenantData.properties);
      console.log("Property name:", finalTenantData.properties?.name);
      console.log("Complete final data:", finalTenantData);
      
      setTenant(finalTenantData);
      
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setHasError(true);
      setTenant(null);
      
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données locataire. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tenant,
    isLoading,
    hasError,
    fetchTenantData
  };
};
