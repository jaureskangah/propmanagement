
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, Mail, Phone, CalendarDays, DollarSign, Building, CreditCard } from "lucide-react";
import { format } from "date-fns";
import type { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";

interface TenantInfoCardProps {
  tenant: Tenant;
}

export const TenantInfoCard = ({ tenant }: TenantInfoCardProps) => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
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
    if (leaseEnded) return t('expired');
    if (leaseEnding) return t('expiring');
    return t('active');
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <div className="bg-primary/5 p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold flex flex-wrap items-center gap-3">
              {tenant.name}
              <Badge variant={getLeaseBadgeVariant()} className="ml-0 mt-1 sm:mt-0">
                {getLeaseBadgeText()}
              </Badge>
            </h2>
            <p className="text-muted-foreground flex items-center">
              <Building className="w-4 h-4 mr-2" />
              {tenant.properties?.name ? tenant.properties.name : t('noProperty')} - {t('unitLabel')} {tenant.unit_number}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6 p-4 sm:p-6`}>
          <InfoItem icon={<Mail className="h-4 w-4" />} label={t('email')} value={tenant.email} />
          <InfoItem icon={<Phone className="h-4 w-4" />} label={t('phone')} value={tenant.phone || t('notProvided')} />
          <InfoItem
            icon={<DollarSign className="h-4 w-4" />}
            label={t('rentAmount')}
            value={`$${tenant.rent_amount}${t('perMonth')}`}
          />
          <InfoItem
            icon={<CalendarDays className="h-4 w-4" />}
            label={t('leaseStart')}
            value={formatDate(tenant.lease_start)}
          />
          <InfoItem
            icon={<CalendarDays className="h-4 w-4" />}
            label={t('leaseEnd')}
            value={formatDate(tenant.lease_end)}
            highlight={leaseEnded || leaseEnding}
          />
          <InfoItem
            icon={<CreditCard className="h-4 w-4" />}
            label={t('securityDeposit')}
            value={tenant.security_deposit ? `$${tenant.security_deposit}` : t('notProvided')}
          />
        </div>
        
        {tenant.notes && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
            <h3 className="font-medium mb-2">{t('notes')}</h3>
            <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
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
          <div className={`flex items-start gap-3 ${highlight ? 'text-amber-600 dark:text-amber-400' : ''}`}>
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
