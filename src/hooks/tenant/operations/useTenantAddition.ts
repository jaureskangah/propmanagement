
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export const useTenantAddition = (refetch: () => void) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddTenant = async (data: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to add a tenant",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("tenants").insert({
        ...data,
        user_id: user.id,
      });

      if (error) {
        throw error;
      }
      
      refetch();
      
      toast({
        title: "Success",
        description: "Tenant added successfully",
      });
    } catch (error: any) {
      console.error("Error adding tenant:", error);
      toast({
        title: "Error adding tenant",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleAddTenant };
};
