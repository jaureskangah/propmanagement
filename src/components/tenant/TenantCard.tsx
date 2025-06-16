
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
  // Fonction de débogage détaillée pour comprendre la structure des données
  const getPropertyName = () => {
    console.log("=== TenantCard getPropertyName DEBUG ===");
    console.log("Tenant ID:", tenant.id);
    console.log("Tenant name:", tenant.name);
    console.log("Tenant property_id:", tenant.property_id);
    console.log("Tenant.properties raw:", tenant.properties);
    console.log("Type of tenant.properties:", typeof tenant.properties);
    console.log("Is Array:", Array.isArray(tenant.properties));
    console.log("Is null:", tenant.properties === null);
    console.log("Is undefined:", tenant.properties === undefined);
    
    // Vérification très explicite
    if (!tenant.properties) {
      console.log("❌ tenant.properties is falsy");
      return "Sans propriété (properties falsy)";
    }
    
    if (typeof tenant.properties !== 'object') {
      console.log("❌ tenant.properties is not an object");
      return "Sans propriété (not object)";
    }
    
    // Si c'est un objet direct avec name
    if (!Array.isArray(tenant.properties) && 'name' in tenant.properties) {
      console.log("✅ Found property name in object:", tenant.properties.name);
      return tenant.properties.name || "Propriété sans nom";
    }
    
    // Si c'est un tableau
    if (Array.isArray(tenant.properties)) {
      console.log("Properties is array, length:", tenant.properties.length);
      if (tenant.properties.length > 0) {
        const firstProperty = tenant.properties[0];
        console.log("First property:", firstProperty);
        if (firstProperty && typeof firstProperty === 'object' && 'name' in firstProperty) {
          console.log("✅ Found property name in array:", firstProperty.name);
          return firstProperty.name || "Propriété sans nom";
        }
      }
      return "Sans propriété (array empty)";
    }
    
    console.log("❌ Unknown properties structure");
    return "Sans propriété (unknown structure)";
  };

  const propertyName = getPropertyName();
  console.log("Final property name for display:", propertyName);

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
