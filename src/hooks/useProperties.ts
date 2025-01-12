import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Property, PropertyFormData } from "@/types/property";
import type { User } from "@supabase/supabase-js";

async function createProfile(user: User) {
  const { error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
    });

  if (insertError) {
    console.error("Error creating profile:", insertError);
    throw insertError;
  }
}

async function addProperty(data: PropertyFormData, user: User): Promise<Property> {
  // First check if profile exists
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Error checking profile:", profileError);
    throw profileError;
  }

  if (!existingProfile) {
    console.log("Profile not found, creating one...");
    await createProfile(user);
  }

  console.log("Adding property with user_id:", user.id);
  const { data: property, error } = await supabase
    .from("properties")
    .insert({ 
      ...data, 
      user_id: user.id,
      image_url: data.image 
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding property:", error);
    throw error;
  }

  return property;
}

async function updateProperty(id: string, data: PropertyFormData): Promise<Property> {
  const { data: property, error } = await supabase
    .from("properties")
    .update({ 
      ...data,
      image_url: data.image 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating property:", error);
    throw error;
  }

  return property;
}

export function useProperties() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const propertiesQuery = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*");
      if (error) throw error;
      return data as Property[];
    }
  });

  const addPropertyMutation = useMutation({
    mutationFn: addProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: updateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  return {
    properties: propertiesQuery.data || [],
    isLoading: propertiesQuery.isLoading,
    error,
    addProperty: addPropertyMutation.mutate,
    updateProperty: updatePropertyMutation.mutate,
  };
}

export type { Property, PropertyFormData };