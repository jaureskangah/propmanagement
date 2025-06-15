import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  type: string;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  name: string;
  address: string;
  units: number;
  type: string;
  image?: string;
}

const fetchProperties = async () => {
  const { data, error } = await supabase
    .from("properties")
    .select("*");

  if (error) {
    throw error;
  }

  return data as Property[];
};

const ensureUserProfile = async (userData: any) => {
  // Vérifier si le profil existe
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (!existingProfile) {
    // Créer le profil s'il n'existe pas
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userData.user.id,
        email: userData.user.email || '',
        first_name: userData.user.user_metadata?.first_name || '',
        last_name: userData.user.user_metadata?.last_name || '',
        is_tenant_user: false,
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      throw new Error("Impossible de créer le profil utilisateur");
    }
  }
};

const createProperty = async (data: PropertyFormData): Promise<Property> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  // Vérifier que l'utilisateur n'est pas un locataire
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_tenant_user")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profile?.is_tenant_user) {
    throw new Error("Les locataires ne peuvent pas ajouter de propriétés");
  }

  // S'assurer que le profil utilisateur existe
  await ensureUserProfile(userData);

  const { data: property, error } = await supabase
    .from("properties")
    .insert([{
      name: data.name,
      address: data.address,
      units: data.units,
      type: data.type,
      image_url: data.image,
      user_id: userData.user.id
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return property;
};

const updateProperty = async ({ id, data }: { id: string; data: PropertyFormData }): Promise<Property> => {
  const { data: property, error } = await supabase
    .from("properties")
    .update({
      name: data.name,
      address: data.address,
      units: data.units,
      type: data.type,
      image_url: data.image,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return property;
};

export function useProperties() {
  const queryClient = useQueryClient();
  const { isTenant } = useAuth();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  const addProperty = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "Succès",
        description: "Propriété ajoutée avec succès",
      });
    },
    onError: (error) => {
      console.error("Error adding property:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout de la propriété",
        variant: "destructive",
      });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: updateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "Succès",
        description: "Propriété mise à jour avec succès",
      });
    },
    onError: (error) => {
      console.error("Error updating property:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour de la propriété",
        variant: "destructive",
      });
    },
  });

  return {
    properties,
    isLoading,
    error: error?.message || "",
    addProperty: addProperty.mutate,
    updateProperty: updatePropertyMutation.mutate,
    canAddProperty: !isTenant, // Nouvelle propriété pour indiquer si l'utilisateur peut ajouter des propriétés
  };
}
