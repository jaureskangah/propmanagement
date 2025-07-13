
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

export const useTenantData = () => {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { user, isTenant } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLocale();

  useEffect(() => {
    console.log("=== USETENANTDATA EFFECT TRIGGERED ===");
    console.log("User:", !!user);
    console.log("User ID:", user?.id);
    console.log("isTenant:", isTenant);

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
    fetchTenantData();
  }, [user?.id, isTenant]);

  const fetchTenantData = async () => {
    if (!user?.id) {
      console.log("No user ID, stopping fetch");
      setIsLoading(false);
      return;
    }

    try {
      console.log("=== FETCHING TENANT DATA ===");
      console.log("User ID:", user.id);
      
      setIsLoading(true);
      setHasError(false);

      // Une seule requête optimisée qui récupère toutes les données nécessaires
      console.log("Fetching all tenant data in one query...");
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
          properties:property_id(name),
          tenant_profile_id
        `)
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      console.log("Tenant query result:", { data: tenantData, error: tenantError });

      if (tenantError) {
        console.error("Error fetching tenant data:", tenantError);
        setHasError(true);
        setTenant(null);
        setIsLoading(false);
        return;
      }

      if (!tenantData) {
        console.log("No tenant data found for user:", user.id);
        setTenant(null);
        setIsLoading(false);
        return;
      }

      // Construire le nom d'affichage à partir des métadonnées utilisateur
      const firstName = user?.user_metadata?.first_name;
      const lastName = user?.user_metadata?.last_name;
      const displayName = firstName && lastName 
        ? `${firstName} ${lastName}` 
        : tenantData.name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
      
      // Gérer les données de propriété
      let propertyData: { name: string } | null = null;
      
      if (tenantData.properties) {
        if (Array.isArray(tenantData.properties)) {
          const firstProperty = tenantData.properties[0];
          if (firstProperty && typeof firstProperty === 'object' && firstProperty !== null) {
            const propertyObj = firstProperty as Record<string, any>;
            if ('name' in propertyObj) {
              propertyData = { name: String(propertyObj.name || "") };
            }
          }
        } else if (typeof tenantData.properties === 'object' && tenantData.properties !== null) {
          const propertyObj = tenantData.properties as Record<string, any>;
          if ('name' in propertyObj) {
            propertyData = { name: String(propertyObj.name || "") };
          }
        }
      }
      
      // Construire l'objet final
      const finalTenantData: TenantData = {
        ...tenantData,
        name: displayName,
        firstName: firstName,
        lastName: lastName,
        fullName: displayName,
        properties: propertyData
      };

      console.log("=== FINAL TENANT DATA READY ===");
      console.log("Setting tenant data:", finalTenantData);
      
      setTenant(finalTenantData);
      setHasError(false);
      
    } catch (error) {
      console.error('EXCEPTION in fetchTenantData:', error);
      setHasError(true);
      setTenant(null);
    } finally {
      console.log("Setting loading to false");
      setIsLoading(false);
    }
  };

  console.log("=== USETENANTDATA HOOK STATE ===");
  console.log("tenant exists:", !!tenant);
  console.log("isLoading:", isLoading);
  console.log("hasError:", hasError);

  return {
    tenant,
    isLoading,
    hasError,
    fetchTenantData
  };
};
