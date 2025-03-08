
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Pencil, Trash2, Phone, Mail, Calendar, Home } from "lucide-react";
import type { Tenant } from "@/types/tenant";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

interface TenantCardProps {
  tenant: Tenant;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getLeaseBadgeVariant = (leaseEnd: string) => {
  const today = new Date();
  const endDate = new Date(leaseEnd);
  const monthsUntilEnd = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (endDate < today) {
    return "destructive";
  } else if (monthsUntilEnd <= 2) {
    return "warning";
  } else {
    return "success";
  }
};

const getLeaseBadgeText = (leaseEnd: string, t: (key: string) => string) => {
  const today = new Date();
  const endDate = new Date(leaseEnd);
  const monthsUntilEnd = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (endDate < today) {
    return t('expired');
  } else if (monthsUntilEnd <= 2) {
    return t('expiring');
  } else {
    return t('active');
  }
};

export const TenantCard = ({
  tenant,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: TenantCardProps) => {
  const isMobile = useIsMobile();
  const { t } = useLocale();

  return (
    <Card
      className={`cursor-pointer hover:bg-accent transition-colors ${
        isSelected ? "border-primary shadow-md" : ""
      }`}
      onClick={() => onSelect(tenant.id)}
    >
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold truncate">{tenant.name}</h3>
              <Badge variant={getLeaseBadgeVariant(tenant.lease_end)} className="animate-fade-in flex-shrink-0">
                {getLeaseBadgeText(tenant.lease_end, t)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
              <Home className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{tenant.properties?.name} - {t('unitLabel')} {tenant.unit_number}</span>
            </p>
          </div>
          <div className="flex gap-2 items-center flex-shrink-0 ml-2">
            {!isMobile && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(tenant.id);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(tenant.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {isMobile && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
          </div>
        </div>
        
        {isMobile ? (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{tenant.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>${tenant.rent_amount}{t('perMonth')}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={tenant.email}>{tenant.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={tenant.phone || t('notAvailable')}>
                {tenant.phone || t('notAvailable')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={`$${tenant.rent_amount}${t('perMonth')}`}>
                ${tenant.rent_amount}{t('perMonth')}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
