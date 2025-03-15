
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import type { Tenant } from "@/types/tenant";

interface TenantSecurityDepositProps {
  tenant: Tenant;
  onUpdateDeposit: (status: "deposited" | "not_deposited") => Promise<void>;
}

export const TenantSecurityDeposit = ({ tenant, onUpdateDeposit }: TenantSecurityDepositProps) => {
  const { t } = useLocale();
  const [securityDepositStatus, setSecurityDepositStatus] = useState<"deposited" | "not_deposited">(
    tenant.security_deposit ? "deposited" : "not_deposited"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleUpdateSecurityDeposit = async () => {
    setIsUpdating(true);
    try {
      await onUpdateDeposit(securityDepositStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  // Determine if the button should be disabled
  const isButtonDisabled = () => {
    if (isUpdating) return true;
    
    // If status is "deposited" and security deposit already exists
    if (securityDepositStatus === "deposited" && tenant.security_deposit !== null && tenant.security_deposit !== undefined) {
      return true;
    }
    
    // If status is "not_deposited" and security deposit doesn't exist
    if (securityDepositStatus === "not_deposited" && (tenant.security_deposit === null || tenant.security_deposit === undefined)) {
      return true;
    }
    
    return false;
  };

  return (
    <div className={cn(
      `border-b border-border/30 px-4 sm:px-6 py-4`,
      'w-full'
    )}>
      <div className="space-y-1 min-w-0">
        <p className="text-xs text-muted-foreground flex items-center mb-2">
          <CreditCard className="h-4 w-4 mr-2 text-primary/70" />
          {t('securityDeposit')}
        </p>
        <div className="space-y-3">
          <RadioGroup 
            value={securityDepositStatus} 
            onValueChange={setSecurityDepositStatus as (value: string) => void}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="deposited" id="deposited" />
              <label htmlFor="deposited" className="text-sm cursor-pointer">
                {t('deposited') || "Déposé"} (${tenant.rent_amount})
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not_deposited" id="not_deposited" />
              <label htmlFor="not_deposited" className="text-sm cursor-pointer">
                {t('notDeposited') || "Non déposé"}
              </label>
            </div>
          </RadioGroup>
          <Button 
            size="sm" 
            onClick={handleUpdateSecurityDeposit}
            disabled={isButtonDisabled()}
            className="w-full max-w-[200px]"
          >
            {isUpdating ? (t('saving') || "Enregistrement...") : (t('update') || "Mettre à jour")}
          </Button>
        </div>
      </div>
    </div>
  );
};
