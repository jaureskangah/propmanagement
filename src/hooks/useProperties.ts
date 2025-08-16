
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

import { ProvinceCode } from "@/types/canadianData";

export interface Property {
  id: string;
  name: string;
  address: string;
  city?: string;
  province?: ProvinceCode;
  postal_code?: string;
  units: number;
  type: string;
  rent_amount: number;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  name: string;
  address: string;
  city: string;
  province: ProvinceCode;
  postal_code: string;
  units: number;
  type: string;
  rent_amount: number;
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
        .select("id, name, address, city, province, postal_code, type, units, rent_amount, image_url, user_id, created_at, updated_at")
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
          city: propertyData.city,
          province: propertyData.province,
          postal_code: propertyData.postal_code,
          units: propertyData.units,
          type: propertyData.type,
          rent_amount: propertyData.rent_amount,
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
          city: data.city,
          province: data.province,
          postal_code: data.postal_code,
          units: data.units,
          type: data.type,
          rent_amount: data.rent_amount,
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
