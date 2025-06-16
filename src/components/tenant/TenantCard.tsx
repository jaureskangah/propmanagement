
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TenantActions } from "./TenantActions";
import { BorderTrail } from "@/components/ui/border-trail";
import type { Tenant } from "@/types/tenant";

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
      className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-[360px] ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <BorderTrail
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500"
        size={60}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          boxShadow: "0px 0px 30px 15px rgb(59 130 246 / 20%)"
        }}
      />
      
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
