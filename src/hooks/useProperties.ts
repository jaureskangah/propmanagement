import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export interface PropertyFormData {
  name: string;
  address: string;
  units: number;
  type: string;
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
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter une propriété.",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // First, ensure the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        console.log("Profile not found, creating one...");
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: user.id }]);

        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }
      } else if (profileError) {
        console.error("Error checking profile:", profileError);
        throw profileError;
      }

      console.log("Adding property with user_id:", user.id);
      
      const { error } = await supabase
        .from("properties")
        .insert([{
          ...data,
          user_id: user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Propriété ajoutée avec succès",
        description: `${data.name} a été ajoutée à votre portfolio.`,
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la propriété:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la propriété.",
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
    isLoading
  };
}