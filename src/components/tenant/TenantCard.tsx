
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Pencil, Trash2, Phone, Mail, Calendar, Home, CreditCard, Check, AlertTriangle } from "lucide-react";
import type { Tenant } from "@/types/tenant";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const badgeVariant = getLeaseBadgeVariant(tenant.lease_end);
  const badgeText = getLeaseBadgeText(tenant.lease_end, t);
  
  const getStatusIcon = () => {
    if (badgeVariant === "success") return <Check className="h-3.5 w-3.5 mr-1" />;
    if (badgeVariant === "warning") return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
    return null;
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:bg-accent/40 group",
        isSelected ? "border-primary/70 shadow-md ring-1 ring-primary/30" : "hover:shadow-sm",
      )}
      onClick={() => onSelect(tenant.id)}
    >
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold truncate">{tenant.name}</h3>
              <Badge 
                variant={badgeVariant} 
                className={cn(
                  "animate-fade-in flex-shrink-0 transition-all",
                  badgeVariant === "success" ? "bg-green-500/15 text-green-600 hover:bg-green-500/20" : "",
                  badgeVariant === "warning" ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/20" : "",
                  badgeVariant === "destructive" ? "bg-red-500/15 text-red-600 hover:bg-red-500/20" : ""
                )}
              >
                {getStatusIcon()}
                {badgeText}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
              <Home className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{tenant.properties?.name || t('noProperty')} - {t('unitLabel')} {tenant.unit_number}</span>
            </p>
          </div>
          <div className="flex gap-2 items-center flex-shrink-0 ml-2">
            {!isMobile && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-70 hover:opacity-100 transition-opacity"
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
                  className="text-destructive hover:text-destructive/90 opacity-70 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(tenant.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            <ChevronRight className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200", 
              isSelected ? "transform translate-x-1" : "",
              "group-hover:translate-x-0.5"
            )} />
          </div>
        </div>
        
        <div className={cn(
          isMobile ? "grid grid-cols-2" : "grid grid-cols-3", 
          "gap-2 pt-2 border-t"
        )}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
            <Mail className="h-4 w-4 flex-shrink-0 text-primary/60" />
            <span className="truncate" title={tenant.email}>{tenant.email}</span>
          </div>
          
          {!isMobile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <Phone className="h-4 w-4 flex-shrink-0 text-primary/60" />
              <span className="truncate" title={tenant.phone || t('notAvailable')}>
                {tenant.phone || t('notAvailable')}
              </span>
            </div>
          )}
          
          <div className={cn(
            "flex items-center gap-2 text-sm min-w-0",
            isMobile ? "justify-end" : ""
          )}>
            <CreditCard className="h-4 w-4 flex-shrink-0 text-primary/60" />
            <span className="truncate font-medium" title={`$${tenant.rent_amount}${t('perMonth')}`}>
              ${tenant.rent_amount}{t('perMonth')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t('leaseStart')}</span>
            <span className="text-sm">{formatDate(tenant.lease_start)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t('leaseEnd')}</span>
            <span className={cn(
              "text-sm",
              badgeVariant === "destructive" ? "text-destructive" : "",
              badgeVariant === "warning" ? "text-amber-600" : ""
            )}>
              {formatDate(tenant.lease_end)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
