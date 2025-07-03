
import { Badge } from "@/components/ui/badge";
import { Building, CheckCircle, AlertCircle, XCircle, UserPlus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Tenant } from "@/types/tenant";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InviteTenantDialog } from "../tenant/communications/InviteTenantDialog";

interface TenantHeaderProps {
  tenant: Tenant;
}

export const TenantHeader = ({ tenant }: TenantHeaderProps) => {
  const { t } = useLocale();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Logging pour débogage avancé
  console.log("TenantHeader - Tenant property data:", tenant.properties);
  console.log("TenantHeader - Properties type:", tenant.properties ? typeof tenant.properties : "undefined");
  console.log("TenantHeader - Property ID:", tenant.property_id);
  
  const leaseEnded = new Date(tenant.lease_end) < new Date();
  const leaseEnding = !leaseEnded && 
    (new Date(tenant.lease_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30) <= 2;

  const getLeaseBadgeVariant = () => {
    if (leaseEnded) return "destructive";
    if (leaseEnding) return "warning";
    return "success";
  };

  const getLeaseBadgeText = () => {
    if (leaseEnded) return t('leaseExpired');
    if (leaseEnding) return t('leaseExpiring');
    return t('leaseActive');
  };
  
  const getLeaseStatusIcon = () => {
    if (leaseEnded) return <XCircle className="h-4 w-4 mr-1" />;
    if (leaseEnding) return <AlertCircle className="h-4 w-4 mr-1" />;
    return <CheckCircle className="h-4 w-4 mr-1" />;
  };

  // Obtenir le nom de la propriété de manière sécurisée - logique corrigée
  const getPropertyName = () => {
    console.log("TenantHeader - Getting property name...");
    
    // Si properties existe et n'est pas null
    if (tenant.properties) {
      // Si c'est un tableau avec des éléments
      if (Array.isArray(tenant.properties) && tenant.properties.length > 0) {
        const firstProperty = tenant.properties[0];
        console.log("TenantHeader - First property from array:", firstProperty);
        if (firstProperty && typeof firstProperty === 'object' && 'name' in firstProperty) {
          return firstProperty.name;
        }
      }
      
      // Si c'est un objet direct avec une propriété name
      if (typeof tenant.properties === 'object' && !Array.isArray(tenant.properties) && 'name' in tenant.properties) {
        console.log("TenantHeader - Property name from object:", tenant.properties.name);
        return tenant.properties.name;
      }
    }
    
    console.log("TenantHeader - No property found, returning default");
    return t('noPropertyAssigned');
  };

  const handleInviteClick = () => {
    setIsInviteDialogOpen(true);
  };

  return (
    <>
      <div className={cn(
        "p-4 sm:p-6 border-b",
        getLeaseBadgeVariant() === "success" ? "bg-green-50 dark:bg-green-950/20" : "",
        getLeaseBadgeVariant() === "warning" ? "bg-amber-50 dark:bg-amber-950/20" : "",
        getLeaseBadgeVariant() === "destructive" ? "bg-red-50 dark:bg-red-950/20" : "",
      )}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold flex flex-wrap items-center gap-3">
              {tenant.name}
              <Badge variant={getLeaseBadgeVariant()} className={cn(
                "ml-0 mt-1 sm:mt-0 transition-colors flex items-center",
                getLeaseBadgeVariant() === "success" ? "bg-green-500/15 text-green-600 hover:bg-green-500/20 dark:text-green-400" : "",
                getLeaseBadgeVariant() === "warning" ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400" : "",
                getLeaseBadgeVariant() === "destructive" ? "bg-red-500/15 text-red-600 hover:bg-red-500/20 dark:text-red-400" : ""
              )}>
                {getLeaseStatusIcon()}
                {getLeaseBadgeText()}
              </Badge>
            </h2>
            <p className="text-muted-foreground flex items-center">
              <Building className="w-4 h-4 mr-2" />
              {getPropertyName()} - {t('unitLabel')} {tenant.unit_number}
            </p>
          </div>
          
          <div className="flex gap-2 self-end sm:self-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleInviteClick}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {t('inviteTenant')}
            </Button>
          </div>
        </div>
      </div>
      
      <InviteTenantDialog 
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        tenantId={tenant.id}
        defaultEmail={tenant.email}
      />
    </>
  );
};
