
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TenantActions } from "./TenantActions";
import { BorderTrail } from "@/components/ui/border-trail";
import { MapPin } from "lucide-react";
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
  // Fonction simplifiée pour obtenir le nom de la propriété
  const getPropertyName = () => {
    console.log("TenantCard - Tenant object:", tenant);
    console.log("TenantCard - Property data:", tenant.properties);
    
    if (tenant.properties && typeof tenant.properties === 'object') {
      // Si c'est un objet direct avec name
      if ('name' in tenant.properties && tenant.properties.name) {
        console.log("TenantCard - Found property name:", tenant.properties.name);
        return tenant.properties.name;
      }
      
      // Si c'est un tableau et qu'il a des éléments
      if (Array.isArray(tenant.properties) && tenant.properties.length > 0) {
        const propertyName = tenant.properties[0]?.name;
        console.log("TenantCard - Found property name from array:", propertyName);
        return propertyName || "Propriété sans nom";
      }
    }
    
    console.log("TenantCard - No property found");
    return "Sans propriété";
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
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{tenant.name}</h3>
            <p className="text-muted-foreground text-sm">{tenant.email}</p>
            {tenant.phone && (
              <p className="text-muted-foreground text-sm">{tenant.phone}</p>
            )}
          </div>
          <Badge variant="secondary">
            Unité {tenant.unit_number}
          </Badge>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {propertyName}
          </p>
        </div>

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
