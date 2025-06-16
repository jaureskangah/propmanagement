
import { Mail, Phone, DollarSign, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import type { Tenant } from "@/types/tenant";
import { InfoItem } from "./InfoItem";

interface TenantInfoGridProps {
  tenant: Tenant;
}

export const TenantInfoGrid = ({ tenant }: TenantInfoGridProps) => {
  const { t } = useLocale();
  
  const leaseEnded = new Date(tenant.lease_end) < new Date();
  const leaseEnding = !leaseEnded && 
    (new Date(tenant.lease_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30) <= 2;

  return (
    <div className={cn(
      `grid gap-4 sm:gap-6 p-4 sm:p-6`,
      'sm:grid-cols-2 lg:grid-cols-3'
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
        value={`$${tenant.rent_amount}`}
        isAmount={true}
      />
      <InfoItem
        icon={<CalendarDays className="h-4 w-4 text-primary/70" />}
        label={t('leaseStartProfileLabel')}
        value={tenant.lease_start}
        isDate={true}
      />
      <InfoItem
        icon={<CalendarDays className="h-4 w-4 text-primary/70" />}
        label={t('leaseEndProfileLabel')}
        value={tenant.lease_end}
        highlight={leaseEnded || leaseEnding}
        isDate={true}
      />
    </div>
  );
};
