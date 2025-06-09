
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useTenantUpdate = (refetch: () => void) => {
  const { toast } = useToast();

  const handleUpdateTenant = async (selectedTenant: string | null, data: any) => {
    if (!selectedTenant) return;
    
    try {
      const { error } = await supabase
        .from("tenants")
        .update({
          ...data,
        })
        .eq("id", selectedTenant);
        
      if (error) {
        throw error;
      }
      
      refetch();
      
      toast({
        title: "Success",
        description: "Tenant updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating tenant:", error);
      toast({
        title: "Error updating tenant",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleUpdateTenant };
};
