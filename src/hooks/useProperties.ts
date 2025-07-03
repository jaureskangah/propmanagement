
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useProperties = () => {
  const { data: properties, isLoading, error } = useQuery({
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
        .select("id, name, address, type, units")
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

  return {
    properties,
    isLoading,
    error,
  };
};
