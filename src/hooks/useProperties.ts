import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

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

const createProperty = async (data: PropertyFormData): Promise<Property> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

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

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  const addProperty = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "Success",
        description: "Property added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: updateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
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
  };
}