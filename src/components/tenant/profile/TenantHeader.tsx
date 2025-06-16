
import { Badge } from "@/components/ui/badge";
import { Building, CheckCircle, AlertCircle, XCircle, UserPlus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Tenant } from "@/types/tenant";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { InviteTenantDialog } from "../communications/InviteTenantDialog";
import { supabase } from "@/lib/supabase";

interface TenantHeaderProps {
  tenant: Tenant;
}

export const TenantHeader = ({ tenant }: TenantHeaderProps) => {
  const { t } = useLocale();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [propertyName, setPropertyName] = useState<string>("Chargement...");
  
  // Récupération du nom de la propriété
  useEffect(() => {
    const getPropertyName = async () => {
      console.log("=== TenantHeader getPropertyName DEBUG ===");
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
  
  const leaseEnded = new Date(tenant.lease_end) < new Date();
  const leaseEnding = !leaseEnded && 
    (new Date(tenant.lease_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30) <= 2;

  const getLeaseBadgeVariant = () => {
    if (leaseEnded) return "destructive";
    if (leaseEnding) return "warning";
    return "success";
  };

  const getLeaseBadgeText = () => {
    if (leaseEnded) return t('list.leaseExpired');
    if (leaseEnding) return t('list.leaseExpiring');
    return t('list.leaseActive');
  };
  
  const getLeaseStatusIcon = () => {
    if (leaseEnded) return <XCircle className="h-4 w-4 mr-1" />;
    if (leaseEnding) return <AlertCircle className="h-4 w-4 mr-1" />;
    return <CheckCircle className="h-4 w-4 mr-1" />;
  };

  const handleInviteClick = () => {
    setIsInviteDialogOpen(true);
  };

  return (
    <>
      <div className={cn(
        "p-4 sm:p-6 border-b",
        getLeaseBadgeVariant() === "success" ? "bg-green-50 dark:bg-green-950/20" : "",
        getLeaseBadgeVariant() === "warning" ? "bg-amber-50 dark:bg-amber-950/20" : "",
        getLeaseBadgeVariant() === "destructive" ? "bg-red-50 dark:bg-red-950/20" : "",
      )}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold flex flex-wrap items-center gap-3">
              {tenant.name}
              <Badge variant={getLeaseBadgeVariant()} className={cn(
                "ml-0 mt-1 sm:mt-0 transition-colors flex items-center",
                getLeaseBadgeVariant() === "success" ? "bg-green-500/15 text-green-600 hover:bg-green-500/20 dark:text-green-400" : "",
                getLeaseBadgeVariant() === "warning" ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400" : "",
                getLeaseBadgeVariant() === "destructive" ? "bg-red-500/15 text-red-600 hover:bg-red-500/20 dark:text-red-400" : ""
              )}>
                {getLeaseStatusIcon()}
                {getLeaseBadgeText()}
              </Badge>
            </h2>
            <p className="text-muted-foreground flex items-center">
              <Building className="w-4 h-4 mr-2" />
              {propertyName} - Unité {tenant.unit_number}
            </p>
          </div>
          
          <div className="flex gap-2 self-end sm:self-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleInviteClick}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {t('inviteTenant')}
            </Button>
          </div>
        </div>
      </div>
      
      <InviteTenantDialog 
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        tenantId={tenant.id}
        defaultEmail={tenant.email}
      />
    </>
  );
};
