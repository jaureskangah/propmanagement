
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, Mail, Phone, CalendarDays, DollarSign, Building, CreditCard, CheckCircle, AlertCircle, XCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import type { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabaseUpdate } from "@/hooks/supabase/useSupabaseUpdate";
import { useToast } from "@/hooks/use-toast";

interface TenantInfoCardProps {
  tenant: Tenant;
}

export const TenantInfoCard = ({ tenant }: TenantInfoCardProps) => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // État pour le dépôt de garantie
  const [securityDepositStatus, setSecurityDepositStatus] = useState(
    tenant.security_deposit ? "deposited" : "not_deposited"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  
  const updateTenant = useSupabaseUpdate("tenants", {
    successMessage: t('depositStatusUpdated') || "Statut du dépôt mis à jour",
  });
  
  console.log("Tenant property details:", {
    propertyId: tenant.property_id,
    propertyName: tenant.properties?.name,
    fullTenant: tenant
  });
  
  // Fonction pour mettre à jour le statut du dépôt de garantie
  const handleUpdateSecurityDeposit = async () => {
    setIsUpdating(true);
    try {
      await updateTenant.mutateAsync({
        id: tenant.id,
        data: {
          security_deposit: securityDepositStatus === "deposited" ? tenant.rent_amount : null
        }
      });
    } catch (error) {
      console.error("Error updating security deposit status:", error);
      toast({
        title: t('error') || "Erreur",
        description: t('errorUpdatingDeposit') || "Erreur lors de la mise à jour du dépôt",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Safely access the property name, fallback to 'noProperty' translation if undefined
  const propertyName = tenant.properties?.name || t('noProperty');
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };

  const leaseEnded = new Date(tenant.lease_end) < new Date();
  const leaseEnding = !leaseEnded && 
    (new Date(tenant.lease_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30) <= 2;

  const getLeaseBadgeVariant = () => {
    if (leaseEnded) return "destructive";
    if (leaseEnding) return "warning";
    return "success";
  };

  const getLeaseBadgeText = () => {
    if (leaseEnded) return t('leaseExpired');
    if (leaseEnding) return t('leaseExpiring');
    return t('leaseActive');
  };
  
  const getLeaseStatusIcon = () => {
    if (leaseEnded) return <XCircle className="h-4 w-4 mr-1" />;
    if (leaseEnding) return <AlertCircle className="h-4 w-4 mr-1" />;
    return <CheckCircle className="h-4 w-4 mr-1" />;
  };

  return (
    <Card className="shadow-sm overflow-hidden border-primary/10 transition-all duration-300 hover:shadow-md dark:bg-gray-900">
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
              {propertyName} - {t('unitLabel')} {tenant.unit_number}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        <div className={cn(
          `grid gap-4 sm:gap-6 p-4 sm:p-6`,
          isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'
        )}>
          <InfoItem 
            icon={<Mail className="h-4 w-4 text-primary/70" />} 
            label={t('emailProfileLabel')} 
            value={tenant.email} 
          />
          <InfoItem 
            icon={<Phone className="h-4 w-4 text-primary/70" />} 
            label={t('phoneProfileLabel')} 
            value={tenant.phone || t('notAvailable')} 
          />
          <InfoItem
            icon={<DollarSign className="h-4 w-4 text-primary/70" />}
            label={t('rentAmountLabel')}
            value={`$${tenant.rent_amount}${t('perMonth')}`}
          />
          <InfoItem
            icon={<CalendarDays className="h-4 w-4 text-primary/70" />}
            label={t('leaseStartProfileLabel')}
            value={formatDate(tenant.lease_start)}
          />
          <InfoItem
            icon={<CalendarDays className="h-4 w-4 text-primary/70" />}
            label={t('leaseEndProfileLabel')}
            value={formatDate(tenant.lease_end)}
            highlight={leaseEnded || leaseEnding}
          />
          <div className={cn(
            `flex flex-col gap-3 p-2 rounded-md transition-colors`,
            'hover:bg-secondary/50'
          )}>
            <div className="space-y-1 min-w-0">
              <p className="text-xs text-muted-foreground flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-primary/70" />
                {t('securityDeposit')}
              </p>
              <div className="space-y-3">
                <RadioGroup 
                  value={securityDepositStatus} 
                  onValueChange={setSecurityDepositStatus}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deposited" id="deposited" />
                    <label htmlFor="deposited" className="text-sm cursor-pointer">
                      {t('deposited') || "Déposé"} (${tenant.rent_amount})
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_deposited" id="not_deposited" />
                    <label htmlFor="not_deposited" className="text-sm cursor-pointer">
                      {t('notDeposited') || "Non déposé"}
                    </label>
                  </div>
                </RadioGroup>
                <Button 
                  size="sm" 
                  onClick={handleUpdateSecurityDeposit}
                  disabled={isUpdating || (securityDepositStatus === "deposited" && tenant.security_deposit) || 
                             (securityDepositStatus === "not_deposited" && !tenant.security_deposit)}
                  className="w-full"
                >
                  {isUpdating ? (t('saving') || "Enregistrement...") : (t('update') || "Mettre à jour")}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {tenant.notes && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
            <h3 className="font-medium mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary/70" />
              {t('notes')}
            </h3>
            <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md border border-border/50">
              {tenant.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

const InfoItem = ({ icon, label, value, highlight = false }: InfoItemProps) => {
  const isMobile = useIsMobile();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            `flex items-start gap-3 p-2 rounded-md transition-colors`,
            highlight ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10' : '',
            'hover:bg-secondary/50'
          )}>
            <div className="mt-0.5 text-muted-foreground">{icon}</div>
            <div className="space-y-1 min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-sm font-medium truncate ${isMobile ? 'max-w-[250px]' : ''}`}>{value}</p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{value}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
