
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Pencil, Trash2, Phone, Mail, Calendar } from "lucide-react";
import type { Tenant } from "@/types/tenant";
import { useIsMobile } from "@/hooks/use-mobile";

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

const getLeaseBadgeText = (leaseEnd: string) => {
  const today = new Date();
  const endDate = new Date(leaseEnd);
  const monthsUntilEnd = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (endDate < today) {
    return "Expired";
  } else if (monthsUntilEnd <= 2) {
    return "Expiring Soon";
  } else {
    return "Active";
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

  return (
    <Card
      className={`cursor-pointer hover:bg-accent transition-colors ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={() => onSelect(tenant.id)}
    >
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{tenant.name}</h3>
              <Badge variant={getLeaseBadgeVariant(tenant.lease_end)} className="animate-fade-in">
                {getLeaseBadgeText(tenant.lease_end)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {tenant.properties?.name} - Unit {tenant.unit_number}
            </p>
          </div>
          <div className="flex gap-2 items-center">
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
        {!isMobile && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={tenant.email}>{tenant.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={tenant.phone || "N/A"}>{tenant.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={`$${tenant.rent_amount}/month`}>
                ${tenant.rent_amount}/month
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
