import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface PropertyFormData {
  name: string;
  address: string;
  units: number;
  type: string;
  image?: string;
}

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

export function useProperties() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchProperties = async (): Promise<Property[]> => {
    console.log("Fetching properties for user:", user?.id);
    if (!user) return [];

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }

    console.log("Fetched properties:", data);
    return data;
  };

  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties", user?.id],
    queryFn: fetchProperties,
    enabled: !!user,
  });

  const addProperty = async (data: PropertyFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to add a property.",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingProfile) {
        console.log("Profile not found, creating one...");
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ 
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name,
            last_name: user.user_metadata?.last_name
          }]);

        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }
      }

      console.log("Adding property with user_id:", user.id);
      
      const { error } = await supabase
        .from("properties")
        .insert([{
          ...data,
          image_url: data.image,
          user_id: user.id,
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["properties", user.id] });

      toast({
        title: "Success",
        description: `${data.name} has been added to your portfolio.`,
      });

      return true;
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while adding the property.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProperty = async (id: string, data: PropertyFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to update a property.",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("properties")
        .update({
          ...data,
          image_url: data.image,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["properties", user.id] });

      toast({
        title: "Success",
        description: `${data.name} has been updated.`,
      });

      return true;
    } catch (error) {
      console.error("Error updating property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while updating the property.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    properties,
    isLoadingProperties,
    addProperty,
    updateProperty,
    isLoading
  };
}