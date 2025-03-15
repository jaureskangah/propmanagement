
import { Badge } from "@/components/ui/badge";
import { Building, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Tenant } from "@/types/tenant";
import { cn } from "@/lib/utils";

interface TenantHeaderProps {
  tenant: Tenant;
}

export const TenantHeader = ({ tenant }: TenantHeaderProps) => {
  const { t } = useLocale();
  
  // Logging pour le débogage des données de propriété
  console.log("Tenant property data:", tenant.properties);
  
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

  // Obtenir le nom de la propriété de manière sécurisée
  const getPropertyName = () => {
    if (!tenant.properties) return t('noProperty');
    
    if (typeof tenant.properties === 'object' && tenant.properties !== null) {
      // Si properties est un objet avec une propriété 'name'
      if ('name' in tenant.properties && typeof tenant.properties.name === 'string') {
        return tenant.properties.name || t('noProperty');
      }
    }
    
    return t('noProperty');
  };

  return (
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
      </div>
    </div>
  );
};
