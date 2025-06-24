
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
      console.log("=== FETCHING TENANT DATA WITH SEPARATE QUERIES ===");
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
      
      // PREMIÈRE REQUÊTE : Récupérer les données du tenant
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
          property_id
        `)
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      console.log("=== TENANT DATA QUERY RESULT ===");
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

      // DEUXIÈME REQUÊTE : Récupérer les données de la propriété si property_id existe
      let propertyData: { name: string } | null = null;
      
      if (tenantData.property_id) {
        console.log("=== FETCHING PROPERTY DATA ===");
        console.log("Property ID:", tenantData.property_id);
        
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('name')
          .eq('id', tenantData.property_id)
          .maybeSingle();

        console.log("Property query result:", property);
        console.log("Property query error:", propertyError);

        if (propertyError) {
          console.error("Error fetching property data:", propertyError);
          // Ne pas arrêter le processus, juste continuer sans données de propriété
        } else if (property && property.name) {
          propertyData = { name: property.name };
          console.log("✅ Successfully fetched property name:", property.name);
        } else {
          console.log("❌ No property found with ID:", tenantData.property_id);
        }
      } else {
        console.log("No property_id in tenant data");
      }

      // Construire le nom d'affichage
      const displayName = profileData?.first_name && profileData?.last_name 
        ? `${profileData.first_name} ${profileData.last_name}` 
        : tenantData.name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
      
      // Construire l'objet final
      const finalTenantData: TenantData = {
        ...tenantData,
        name: displayName,
        firstName: profileData?.first_name || user?.user_metadata?.first_name,
        lastName: profileData?.last_name || user?.user_metadata?.last_name,
        fullName: displayName,
        properties: propertyData
      };

      console.log("=== FINAL TENANT DATA WITH SEPARATE QUERIES ===");
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
