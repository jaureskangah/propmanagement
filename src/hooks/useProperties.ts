import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export interface PropertyFormData {
  name: string;
  address: string;
  units: number;
  type: string;
}

export function useProperties() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const addProperty = async (data: PropertyFormData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    setIsLoading(true);
    try {
      console.log("Adding property with user_id:", user.id);
      
      const { error } = await supabase.from("properties").insert([
        {
          ...data,
          user_id: user.id,
        },
      ]);

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
    addProperty,
    isLoading
  };
}