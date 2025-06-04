
import { Card } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useSupabaseUpdate } from "@/hooks/supabase/useSupabaseUpdate";
import { useToast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";
import { TenantHeader } from "./TenantHeader";
import { TenantInfoGrid } from "./TenantInfoGrid";
import { TenantSecurityDeposit } from "./TenantSecurityDeposit";
import { TenantNotes } from "./TenantNotes";

interface TenantInfoCardProps {
  tenant: Tenant;
  onInviteClick?: () => void;
}

export const TenantInfoCard = ({ tenant, onInviteClick }: TenantInfoCardProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  
  const updateTenant = useSupabaseUpdate("tenants", {
    successMessage: t('depositStatusUpdated') || "Statut du dépôt mis à jour",
  });
  
  const handleUpdateSecurityDeposit = async (securityDepositStatus: "deposited" | "not_deposited") => {
    try {
      await updateTenant.mutateAsync({
        id: tenant.id,
        data: {
          security_deposit: securityDepositStatus === "deposited" ? tenant.rent_amount : null
        }
      });
    } catch (error) {
      console.error("Error updating security deposit status:", error);
      toast({
        title: t('error') || "Erreur",
        description: t('errorUpdatingDeposit') || "Erreur lors de la mise à jour du dépôt",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-sm overflow-hidden border-primary/10 transition-all duration-300 hover:shadow-md dark:bg-gray-900">
      <TenantHeader tenant={tenant} onInviteClick={onInviteClick} />

      <div className="p-0">
        <TenantSecurityDeposit 
          tenant={tenant} 
          onUpdateDeposit={handleUpdateSecurityDeposit} 
        />
        
        <TenantInfoGrid tenant={tenant} />
        
        {tenant.notes && <TenantNotes notes={tenant.notes} />}
      </div>
    </Card>
  );
};
