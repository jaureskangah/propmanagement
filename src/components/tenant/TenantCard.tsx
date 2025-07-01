
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TenantActions } from "./TenantActions";
import { BorderTrail } from "@/components/ui/border-trail";
import { MapPin, Phone, Mail } from "lucide-react";
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

  // Calculate lease status for gradient
  const leaseEnded = new Date(tenant.lease_end) < new Date();
  const leaseEnding = !leaseEnded && 
    (new Date(tenant.lease_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30) <= 2;

  // Get gradient based on lease status
  const getBackgroundGradient = () => {
    if (leaseEnded) {
      return "from-red-500/10 to-red-600/10";
    }
    if (leaseEnding) {
      return "from-amber-500/10 to-amber-600/10";
    }
    return "from-green-500/10 to-green-600/10";
  };

  // Get border color based on lease status
  const getBorderColor = () => {
    if (leaseEnded) {
      return "border-red-200 dark:border-red-800";
    }
    if (leaseEnding) {
      return "border-amber-200 dark:border-amber-800";
    }
    return "border-green-200 dark:border-green-800";
  };

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
      className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full max-w-[400px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm bg-gradient-to-br ${getBackgroundGradient()} border ${getBorderColor()} ${
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
      
      <CardContent className="p-6">
        {/* Header with name and unit badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
              {tenant.name}
            </h3>
          </div>
          <Badge variant="secondary" className="ml-3 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-semibold">
            Unité {tenant.unit_number}
          </Badge>
        </div>

        {/* Contact information section */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{tenant.email}</span>
          </div>
          {tenant.phone && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{tenant.phone}</span>
            </div>
          )}
        </div>

        {/* Property location */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {propertyName}
          </span>
        </div>

        {/* Actions - centered */}
        <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
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
