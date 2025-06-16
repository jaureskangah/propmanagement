
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TenantActions } from "./TenantActions";
import { BorderTrail } from "@/components/ui/border-trail";
import { MapPin, Phone, Mail, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
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
  const { t, locale } = useLocale();
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
      className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-[380px] ${
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
            {t('list.unit')} {tenant.unit_number}
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

        {/* Lease period */}
        <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Période de bail</div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {formatDate(tenant.lease_start, locale)} - {formatDate(tenant.lease_end, locale)}
          </div>
        </div>

        {/* Rent amount - highlighted */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-lg font-bold text-green-700 dark:text-green-300">
            {formatCurrency(tenant.rent_amount)} / {t('perMonth')}
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
