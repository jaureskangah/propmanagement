
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import type { Tenant } from "@/types/tenant";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";

interface TenantSecurityDepositProps {
  tenant: Tenant;
  onUpdateDeposit: (status: "deposited" | "not_deposited") => Promise<void>;
}

export const TenantSecurityDeposit = ({ tenant, onUpdateDeposit }: TenantSecurityDepositProps) => {
  const { t } = useLocale();
  const { user } = useAuth();
  const [securityDepositStatus, setSecurityDepositStatus] = useState<"deposited" | "not_deposited">(
    tenant.security_deposit ? "deposited" : "not_deposited"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check if the current user is the tenant viewing their own profile
  const isTenantUser = user?.id === tenant.tenant_profile_id;
  
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-3 sm:mb-0">
          <p className="text-xs text-muted-foreground flex items-center mb-2">
            <CreditCard className="h-4 w-4 mr-2 text-primary/70" />
            {t('securityDeposit')}
          </p>
          
          {isTenantUser ? (
            // Read-only view for tenants
            <div className="flex items-center">
              <Badge 
                variant={tenant.security_deposit ? "success" : "secondary"}
                className={cn(
                  "px-3 py-1 text-sm",
                  tenant.security_deposit ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                {tenant.security_deposit 
                  ? `${t('deposited')} ($${tenant.rent_amount})` 
                  : t('notDeposited')}
              </Badge>
            </div>
          ) : (
            // Interactive radio buttons for owners
            <RadioGroup 
              value={securityDepositStatus} 
              onValueChange={setSecurityDepositStatus as (value: string) => void}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deposited" id="deposited" />
                <label htmlFor="deposited" className="text-sm cursor-pointer">
                  {t('deposited')} (${tenant.rent_amount})
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_deposited" id="not_deposited" />
                <label htmlFor="not_deposited" className="text-sm cursor-pointer">
                  {t('notDeposited')}
                </label>
              </div>
            </RadioGroup>
          )}
        </div>
        
        {!isTenantUser && (
          <Button 
            size="sm" 
            onClick={handleUpdateSecurityDeposit}
            disabled={isButtonDisabled()}
            className="w-full sm:w-auto"
          >
            {isUpdating ? t('saving') : t('update')}
          </Button>
        )}
      </div>
    </div>
  );
};
