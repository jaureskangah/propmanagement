
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
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t('list.tenantsList')}</h1>
            <p className="text-muted-foreground mt-1">{t('list.tenantsSubtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            <Info className="h-4 w-4 mr-1.5" />
            {tenantCount} {tenantCount === 1 ? t('list.tenant') : t('list.tenants')}
          </Badge>
          
          {isMobile ? (
            <Button 
              size="sm" 
              className="flex items-center gap-1.5" 
              onClick={onAddClick}
            >
              <UserPlus className="h-4 w-4" />
              {t('list.addTenant')}
            </Button>
          ) : (
            <TenantActions onAddClick={onAddClick} />
          )}
        </div>
      </div>
    </div>
  );
};
