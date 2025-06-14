
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tenantId: string) => {
      console.log("=== STARTING TENANT DELETION ===");
      console.log("Deleting tenant with ID:", tenantId);

      // Supprimer d'abord les données liées
      const { error: documentsError } = await supabase
        .from('tenant_documents')
        .delete()
        .eq('tenant_id', tenantId);

      if (documentsError) {
        console.error("Error deleting tenant documents:", documentsError);
      }

      const { error: paymentsError } = await supabase
        .from('tenant_payments')
        .delete()
        .eq('tenant_id', tenantId);

      if (paymentsError) {
        console.error("Error deleting tenant payments:", paymentsError);
      }

      const { error: communicationsError } = await supabase
        .from('tenant_communications')
        .delete()
        .eq('tenant_id', tenantId);

      if (communicationsError) {
        console.error("Error deleting tenant communications:", communicationsError);
      }

      const { error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('tenant_id', tenantId);

      if (maintenanceError) {
        console.error("Error deleting maintenance requests:", maintenanceError);
      }

      const { error: invitationsError } = await supabase
        .from('tenant_invitations')
        .delete()
        .eq('tenant_id', tenantId);

      if (invitationsError) {
        console.error("Error deleting tenant invitations:", invitationsError);
      }

      // Enfin, supprimer le locataire
      const { error: tenantError } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId);

      if (tenantError) {
        console.error("Error deleting tenant:", tenantError);
        throw tenantError;
      }

      console.log("✅ Tenant deleted successfully");
      return { success: true };
    },
    onSuccess: () => {
      console.log("Tenant deletion completed successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast({
        title: "Succès",
        description: "Locataire supprimé avec succès",
      });
    },
    onError: (error: any) => {
      console.error("Failed to delete tenant:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le locataire",
        variant: "destructive",
      });
    },
  });
};
