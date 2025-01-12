import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

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

async function addProperty(data: PropertyFormData): Promise<Property> {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  console.log("Adding property with user_id:", user.user.id);
  const { data: property, error } = await supabase
    .from("properties")
    .insert({ 
      ...data, 
      user_id: user.user.id,
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
    mutationFn: (data: PropertyFormData) => addProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PropertyFormData }) => updateProperty(id, data),
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
    addProperty: addPropertyMutation.mutateAsync,
    updateProperty: updatePropertyMutation.mutateAsync,
  };
}