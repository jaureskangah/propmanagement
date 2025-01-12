import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Property } from "@/types/property";
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

async function addProperty(data: Partial<Property>, user: User) {
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
    .insert({ ...data, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Error adding property:", error);
    throw error;
  }

  return property;
}

export function useProperties() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const propertiesQuery = useQuery(["properties"], async () => {
    const { data, error } = await supabase.from("properties").select("*");
    if (error) throw error;
    return data;
  });

  const addPropertyMutation = useMutation(addProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  return {
    properties: propertiesQuery.data,
    isLoading: propertiesQuery.isLoading,
    error,
    addProperty: addPropertyMutation.mutate,
  };
}
