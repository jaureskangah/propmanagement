
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
    console.log("=== USETENANTDATA EFFECT TRIGGERED ===");
    console.log("User:", user);
    console.log("isTenant:", isTenant);
    console.log("User ID:", user?.id);

    if (!user) {
      console.log("No user found, setting tenant to null");
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

    console.log("User is a tenant, fetching tenant data...");
    // Toujours récupérer les données fraîches depuis la base de données
    fetchTenantData();
  }, [user?.id, isTenant]);

  const fetchTenantData = async () => {
    if (!user?.id) {
      console.log("No user ID, stopping fetch");
      setIsLoading(false);
      return;
    }

    try {
      console.log("=== FETCHING TENANT DATA WITH SINGLE QUERY ===");
      console.log("User ID:", user.id);
      console.log("User email:", user.email);
      
      setIsLoading(true);
      setHasError(false);

      // Récupérer les données du profil
      console.log("Step 1: Fetching profile data...");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, is_tenant_user')
        .eq('id', user.id)
        .maybeSingle();
        
      console.log("Profile data:", profileData);
      console.log("Profile error:", profileError);
      
      // Vérifier que l'utilisateur est bien un locataire
      if (!profileData?.is_tenant_user) {
        console.log("User is not a tenant user according to profile");
        setTenant(null);
        setIsLoading(false);
        return;
      }
      
      // REQUÊTE UNIQUE : Récupérer les données du tenant avec la propriété en JOIN
      console.log("Step 2: Fetching tenant data with property...");
      const { data: tenantData, error: tenantError } = await supabase
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

      console.log("=== SINGLE QUERY RESULT ===");
      console.log("Data:", tenantData);
      console.log("Error:", tenantError);

      if (tenantError) {
        console.error("Error fetching tenant data:", tenantError);
        setHasError(true);
        setTenant(null);
        return;
      }

      if (!tenantData) {
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
        : tenantData.name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
      
      // Gérer les données de propriété - s'assurer qu'on a le bon format
      let propertyData: { name: string } | null = null;
      
      console.log("Step 3: Processing property data...");
      console.log("Raw properties data:", tenantData.properties);
      
      if (tenantData.properties) {
        // Si c'est un tableau, prendre le premier élément
        if (Array.isArray(tenantData.properties)) {
          const firstProperty = tenantData.properties[0];
          console.log("Property is array, first element:", firstProperty);
          if (firstProperty && typeof firstProperty === 'object' && firstProperty !== null) {
            // Type assertion sécurisée après vérification
            const propertyObj = firstProperty as Record<string, any>;
            if ('name' in propertyObj) {
              propertyData = { name: String(propertyObj.name || "") };
            }
          }
        } 
        // Si c'est déjà un objet
        else if (typeof tenantData.properties === 'object' && tenantData.properties !== null) {
          const propertyObj = tenantData.properties as Record<string, any>;
          console.log("Property is object:", propertyObj);
          if ('name' in propertyObj) {
            propertyData = { name: String(propertyObj.name || "") };
          }
        }
      }
      
      console.log("Processed property data:", propertyData);
      
      // Construire l'objet final
      const finalTenantData: TenantData = {
        ...tenantData,
        name: displayName,
        firstName: profileData?.first_name || user?.user_metadata?.first_name,
        lastName: profileData?.last_name || user?.user_metadata?.last_name,
        fullName: displayName,
        properties: propertyData
      };

      console.log("=== FINAL TENANT DATA WITH SINGLE QUERY ===");
      console.log("Tenant ID:", finalTenantData.id);
      console.log("Property ID:", finalTenantData.property_id);
      console.log("Properties object:", finalTenantData.properties);
      console.log("Property name:", finalTenantData.properties?.name);
      console.log("Complete final data:", finalTenantData);
      
      setTenant(finalTenantData);
      console.log("Tenant data set successfully");
      
    } catch (error) {
      console.error('EXCEPTION in fetchTenantData:', error);
      setHasError(true);
      setTenant(null);
      
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données locataire. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      console.log("Setting loading to false");
      setIsLoading(false);
    }
  };

  console.log("=== USETENANTDATA HOOK STATE ===");
  console.log("tenant:", tenant);
  console.log("isLoading:", isLoading);
  console.log("hasError:", hasError);

  return {
    tenant,
    isLoading,
    hasError,
    fetchTenantData
  };
};
