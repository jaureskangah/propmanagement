
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TenantActions } from "./TenantActions";
import { BorderTrail } from "@/components/ui/border-trail";
import { MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
  const [propertyName, setPropertyName] = useState<string>("Chargement...");

  // Récupération du nom de la propriété
  useEffect(() => {
    const getPropertyName = async () => {
      console.log("=== TenantCard getPropertyName DEBUG ===");
      console.log("Tenant ID:", tenant.id);
      console.log("Tenant name:", tenant.name);
      console.log("Tenant property_id:", tenant.property_id);
      console.log("Tenant.properties raw:", tenant.properties);
      
      // Première tentative : utiliser les données de la jointure
      if (tenant.properties && typeof tenant.properties === 'object' && !Array.isArray(tenant.properties) && 'name' in tenant.properties) {
        console.log("✅ Found property name in joined data:", tenant.properties.name);
        setPropertyName(tenant.properties.name || "Propriété sans nom");
        return;
      }
      
      // Deuxième tentative : requête directe si on a un property_id
      if (tenant.property_id) {
        console.log("🔍 Fetching property directly with ID:", tenant.property_id);
        try {
          const { data, error } = await supabase
            .from("properties")
            .select("name")
            .eq("id", tenant.property_id)
            .single();
          
          if (error) {
            console.error("❌ Error fetching property:", error);
            setPropertyName("Erreur propriété");
          } else if (data && data.name) {
            console.log("✅ Found property name via direct query:", data.name);
            setPropertyName(data.name);
          } else {
            console.log("❌ No property found with this ID");
            setPropertyName("Propriété introuvable");
          }
        } catch (err) {
          console.error("❌ Exception fetching property:", err);
          setPropertyName("Erreur propriété");
        }
      } else {
        console.log("❌ No property_id");
        setPropertyName("Sans propriété");
      }
    };

    getPropertyName();
  }, [tenant.property_id, tenant.properties]);

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
