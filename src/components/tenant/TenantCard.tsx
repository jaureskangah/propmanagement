
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TenantActions } from "./TenantActions";
import type { Tenant } from "@/types/tenant";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantCardProps {
  tenant: Tenant;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onInvite: () => void;
}

export const TenantCard = ({
  tenant,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onInvite,
}: TenantCardProps) => {
  const { language } = useLocale();
  
  // Get property name safely
  const getPropertyName = () => {
    if (!tenant.properties) return null;
    if (Array.isArray(tenant.properties)) {
      return tenant.properties[0]?.name || null;
    }
    return tenant.properties.name || null;
  };

  const propertyName = getPropertyName();

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{tenant.name}</h3>
            <p className="text-muted-foreground text-sm">{tenant.email}</p>
          </div>
          <Badge variant="secondary">
            Unit {tenant.unit_number}
          </Badge>
        </div>

        {propertyName && (
          <p className="text-sm text-muted-foreground mb-2">
            {propertyName}
          </p>
        )}

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">
            ${tenant.rent_amount.toLocaleString()}/month
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(tenant.lease_start), {
              addSuffix: true,
              locale: language === 'fr' ? fr : undefined
            })}
          </span>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <TenantActions
            onEdit={onEdit}
            onDelete={onDelete}
            onInvite={onInvite}
          />
        </div>
      </CardContent>
    </Card>
  );
};
