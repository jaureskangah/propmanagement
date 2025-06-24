
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
  const { user, isTenant, tenantData } = useAuth();
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

    // Si on a déjà les données du locataire dans AuthProvider, on les utilise
    if (tenantData) {
      console.log("Using tenant data from AuthProvider:", tenantData);
      setTenant({
        ...tenantData,
        fullName: tenantData.name
      });
      setIsLoading(false);
      return;
    }

    // Sinon, on essaie de récupérer les données
    fetchTenantData();
  }, [user?.id, isTenant, tenantData]);

  const fetchTenantData = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("=== FETCHING TENANT DATA ===");
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
      
      // ÉTAPE 1: Récupérer les données du locataire (requête simple)
      const { data: tenantRecord, error: tenantError } = await supabase
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

      console.log("Tenant record result:", tenantRecord, tenantError);

      if (tenantError) {
        console.error("Error fetching tenant data:", tenantError);
        setHasError(true);
        setTenant(null);
        return;
      }

      if (!tenantRecord) {
        console.log("No tenant data found for user:", user.id);
        setTenant(null);
        
        toast({
          title: "Profil locataire non trouvé",
          description: "Aucun profil locataire n'a été trouvé pour votre compte. Contactez votre gestionnaire.",
          variant: "destructive",
        });
        return;
      }

      // ÉTAPE 2: Si le locataire est lié à une propriété, récupérer les données de la propriété
      let propertyData: { name: string } | null = null;
      
      if (tenantRecord.property_id) {
        console.log("Fetching property data for property_id:", tenantRecord.property_id);
        
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('name')
          .eq('id', tenantRecord.property_id)
          .maybeSingle();

        console.log("Property data result:", property, propertyError);
        
        if (propertyError) {
          console.error("Error fetching property data:", propertyError);
        } else if (property) {
          propertyData = { name: property.name };
          console.log("✅ Property data found:", propertyData);
        } else {
          console.log("❌ No property found for ID:", tenantRecord.property_id);
        }
      } else {
        console.log("No property_id linked to tenant");
      }

      // ÉTAPE 3: Construire l'objet final avec la logique simple
      const displayName = profileData?.first_name && profileData?.last_name 
        ? `${profileData.first_name} ${profileData.last_name}` 
        : tenantRecord.name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
      
      const finalTenantData: TenantData = {
        ...tenantRecord,
        name: displayName,
        firstName: profileData?.first_name || user?.user_metadata?.first_name,
        lastName: profileData?.last_name || user?.user_metadata?.last_name,
        fullName: displayName,
        properties: propertyData
      };

      console.log("=== FINAL TENANT DATA ===");
      console.log("Property ID:", finalTenantData.property_id);
      console.log("Property data:", finalTenantData.properties);
      console.log("Property name:", finalTenantData.properties?.name);
      console.log("Complete tenant data:", finalTenantData);
      
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
