
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

export const useProperties = () => {
  const queryClient = useQueryClient();
  const { isTenant } = useAuth();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      console.log("Fetching properties for tenant form...");
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error("User not authenticated:", authError);
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from("properties")
        .select("id, name, address, type, units, image_url, user_id, created_at, updated_at")
        .eq("user_id", user.id)
        .order("name");

      if (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error",
          description: "Failed to load properties",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Properties loaded:", data);
      return data;
    },
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (propertyData: PropertyFormData) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from("properties")
        .insert({
          name: propertyData.name,
          address: propertyData.address,
          units: propertyData.units,
          type: propertyData.type,
          image_url: propertyData.image,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PropertyFormData }) => {
      const { data: updatedProperty, error } = await supabase
        .from("properties")
        .update({
          name: data.name,
          address: data.address,
          units: data.units,
          type: data.type,
          image_url: data.image,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updatedProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  return {
    properties,
    isLoading,
    error,
    canAddProperty: !isTenant,
    addProperty: addPropertyMutation.mutateAsync,
    updateProperty: updatePropertyMutation.mutateAsync,
  };
};
