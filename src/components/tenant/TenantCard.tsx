
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
  // Fonction robuste pour obtenir le nom de la propriété
  const getPropertyName = () => {
    console.log("=== TenantCard getPropertyName DEBUG ===");
    console.log("Tenant ID:", tenant.id);
    console.log("Tenant name:", tenant.name);
    console.log("Tenant property_id:", tenant.property_id);
    console.log("Tenant.properties raw:", tenant.properties);
    
    // Si pas de properties mais qu'on a un property_id, il y a un problème avec la requête
    if (!tenant.properties && tenant.property_id) {
      console.log("⚠️ No properties data but property_id exists - query issue");
      return "Propriété non chargée";
    }
    
    // Si pas de properties du tout
    if (!tenant.properties) {
      console.log("❌ No properties and no property_id");
      return "Sans propriété";
    }
    
    // Si c'est un objet avec une propriété name
    if (typeof tenant.properties === 'object' && !Array.isArray(tenant.properties) && 'name' in tenant.properties) {
      console.log("✅ Found property name in object:", tenant.properties.name);
      return tenant.properties.name || "Propriété sans nom";
    }
    
    console.log("❌ Properties structure not recognized");
    return "Erreur propriété";
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
