
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
  const [linkingAttempted, setLinkingAttempted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLocale();

  useEffect(() => {
    if (user) {
      fetchTenantData();
    } else {
      setIsLoading(false);
    }
  }, [user, language]);

  const attemptTenantLinking = async (email: string, userId: string): Promise<any> => {
    console.log("Attempting tenant linking for email:", email);
    
    try {
      // Chercher un locataire non lié avec cette adresse email
      const { data: tenantByEmail, error: emailError } = await supabase
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
          tenant_profile_id,
          properties:property_id(name)
        `)
        .eq('email', email)
        .is('tenant_profile_id', null)
        .maybeSingle();

      if (emailError) {
        console.error("Error searching tenant by email:", emailError);
        return null;
      }

      if (!tenantByEmail) {
        console.log("No unlinked tenant found for email:", email);
        return null;
      }

      console.log("Found unlinked tenant, attempting to link:", tenantByEmail.id);

      // Tenter de lier le locataire
      const { error: linkError } = await supabase
        .from('tenants')
        .update({ 
          tenant_profile_id: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenantByEmail.id)
        .eq('email', email); // Double vérification pour la sécurité

      if (linkError) {
        console.error("Error linking tenant profile:", linkError);
        return null;
      }

      console.log("Successfully linked tenant profile");
      
      // Vérifier que la liaison a bien fonctionné
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: verificationData, error: verificationError } = await supabase
        .from('tenants')
        .select('tenant_profile_id')
        .eq('id', tenantByEmail.id)
        .single();

      if (verificationError || verificationData?.tenant_profile_id !== userId) {
        console.error("Linking verification failed:", verificationError);
        return null;
      }

      return tenantByEmail;
    } catch (error) {
      console.error("Exception during tenant linking:", error);
      return null;
    }
  };

  const forceTenantLinking = async (userId: string, email: string): Promise<any> => {
    console.log("=== FORCE TENANT LINKING ===");
    console.log("User ID:", userId);
    console.log("Email:", email);

    try {
      // Rechercher TOUS les locataires avec cette adresse email
      const { data: allTenants, error: searchError } = await supabase
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
          tenant_profile_id,
          properties:property_id(name)
        `)
        .eq('email', email);

      if (searchError) {
        console.error("Error searching all tenants:", searchError);
        return null;
      }

      if (!allTenants || allTenants.length === 0) {
        console.log("No tenants found for email:", email);
        return null;
      }

      console.log("Found tenants for email:", allTenants);

      // Chercher d'abord un locataire déjà lié à ce user
      const alreadyLinked = allTenants.find(t => t.tenant_profile_id === userId);
      if (alreadyLinked) {
        console.log("Found already linked tenant:", alreadyLinked.id);
        return alreadyLinked;
      }

      // Sinon, chercher un locataire non lié
      const unlinked = allTenants.find(t => !t.tenant_profile_id);
      if (unlinked) {
        console.log("Found unlinked tenant, attempting forced linking:", unlinked.id);
        
        const { error: forceLinkError } = await supabase
          .from('tenants')
          .update({ 
            tenant_profile_id: userId,
            updated_at: new Date().toISOString()
          })
          .eq('id', unlinked.id);

        if (forceLinkError) {
          console.error("Force linking failed:", forceLinkError);
          return null;
        }

        console.log("Force linking successful");
        return { ...unlinked, tenant_profile_id: userId };
      }

      // En dernier recours, prendre le premier locataire (même s'il est lié à un autre user)
      // Ceci peut arriver si il y a eu des problèmes de données
      const firstTenant = allTenants[0];
      console.log("No unlinked tenant found, attempting to override link for:", firstTenant.id);
      
      const { error: overrideLinkError } = await supabase
        .from('tenants')
        .update({ 
          tenant_profile_id: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', firstTenant.id);

      if (overrideLinkError) {
        console.error("Override linking failed:", overrideLinkError);
        return null;
      }

      console.log("Override linking successful");
      return { ...firstTenant, tenant_profile_id: userId };

    } catch (error) {
      console.error("Exception during force linking:", error);
      return null;
    }
  };

  const fetchTenantData = async () => {
    try {
      setIsLoading(true);
      
      console.log("=== FETCHING TENANT DATA ===");
      console.log("User ID:", user?.id);
      console.log("User email:", user?.email);
      console.log("User metadata:", user?.user_metadata);
      
      // D'abord récupérer les données du profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, is_tenant_user')
        .eq('id', user?.id)
        .maybeSingle();
        
      console.log("Profile data:", profileData);
      
      // Vérifier si c'est bien un utilisateur locataire
      if (!profileData?.is_tenant_user && !user?.user_metadata?.is_tenant_user) {
        console.log("User is not a tenant user");
        setIsLoading(false);
        return;
      }
      
      // Essayer de récupérer les données du locataire avec tenant_profile_id
      let { data: tenant, error } = await supabase
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

      console.log("Tenant by profile_id result:", tenant, error);

      // Si pas trouvé par tenant_profile_id, essayer différentes stratégies de liaison
      if (!tenant && user?.email && !linkingAttempted) {
        console.log("No tenant found by profile_id, attempting linking strategies...");
        setLinkingAttempted(true);
        
        // Stratégie 1: Liaison automatique normale
        let linkedTenant = await attemptTenantLinking(user.email, user.id);
        
        // Stratégie 2: Si échec, forcer la liaison
        if (!linkedTenant) {
          console.log("Normal linking failed, attempting force linking...");
          linkedTenant = await forceTenantLinking(user.id, user.email);
        }
        
        if (linkedTenant) {
          tenant = linkedTenant;
          console.log("Tenant successfully linked:", tenant.id);
          
          toast({
            title: "Profil locataire trouvé",
            description: "Votre profil a été automatiquement lié à votre compte locataire.",
          });
        }
      }

      if (error && !tenant) {
        console.error("Error fetching tenant data:", error);
        throw error;
      }

      console.log("Final tenant data:", tenant);
      
      if (tenant) {
        console.log("Raw properties data structure:", JSON.stringify(tenant.properties));
      
        // Utiliser le nom du profil si disponible, sinon utiliser le nom du locataire
        const displayName = profileData?.first_name && profileData?.last_name 
          ? `${profileData.first_name} ${profileData.last_name}` 
          : tenant.name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
        
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
      } else {
        console.log("No tenant data found for user:", user?.id);
        setTenant(null);
        
        // Afficher un message d'aide si aucun locataire n'a été trouvé après toutes les tentatives
        if (linkingAttempted) {
          toast({
            title: "Profil locataire non trouvé",
            description: "Aucun profil locataire n'a pu être trouvé ou lié à votre compte. Contactez votre gestionnaire.",
            variant: "destructive",
          });
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setIsLoading(false);
      setTenant(null);
      
      // Ne pas afficher d'erreur toast pour éviter le spam si l'utilisateur vient de créer son compte
      if (linkingAttempted) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données locataire. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    }
  };

  return {
    tenant,
    isLoading,
    fetchTenantData
  };
};
