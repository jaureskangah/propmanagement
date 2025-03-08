
import React from "react";
import { Users, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantActions } from "@/components/tenant/TenantActions";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface TenantsHeaderProps {
  tenantCount: number;
  onAddClick: () => void;
  isMobile: boolean;
}

export const TenantsHeader = ({ tenantCount, onAddClick, isMobile }: TenantsHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 md:h-7 md:w-7 text-primary/80" />
            {t('tenantsList')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('tenantsSubtitle')}
          </p>
        </div>
        <div className="flex items-center justify-between lg:justify-end gap-4">
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            <Info className="h-4 w-4 mr-1.5" />
            {tenantCount} {tenantCount === 1 ? t('tenant') : t('tenants')}
          </Badge>
          
          {isMobile ? (
            <Button 
              size="sm" 
              className="flex items-center gap-1.5" 
              onClick={onAddClick}
            >
              <UserPlus className="h-4 w-4" />
              {t('addTenant')}
            </Button>
          ) : (
            <TenantActions onAddClick={onAddClick} />
          )}
        </div>
      </div>
    </div>
  );
};
