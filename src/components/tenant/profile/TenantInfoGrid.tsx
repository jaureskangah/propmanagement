
import { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { format } from "date-fns";
import { HomeIcon, CalendarIcon, BanknotesIcon, IdentificationIcon } from "lucide-react";

interface TenantInfoGridProps {
  tenant: Tenant;
}

export const TenantInfoGrid = ({ tenant }: TenantInfoGridProps) => {
  const { t } = useLocale();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      <div className="flex items-start gap-3">
        <HomeIcon className="h-5 w-5 text-blue-600 mt-1" />
        <div>
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">{t('property')}</p>
          <p className="font-medium">
            {tenant.properties?.name || t('noPropertyAssigned')}
            {tenant.unit_number ? ` · ${t('unit')} ${tenant.unit_number}` : ''}
          </p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <CalendarIcon className="h-5 w-5 text-green-600 mt-1" />
        <div>
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">{t('leaseRange')}</p>
          <p className="font-medium">
            {format(new Date(tenant.lease_start), 'PP')} - {format(new Date(tenant.lease_end), 'PP')}
          </p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <BanknotesIcon className="h-5 w-5 text-amber-600 mt-1" />
        <div>
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">{t('monthlyRent')}</p>
          <p className="font-medium">${tenant.rent_amount?.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <IdentificationIcon className="h-5 w-5 text-purple-600 mt-1" />
        <div>
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">{t('contactInfo')}</p>
          <p className="font-medium">{tenant.email} {tenant.phone ? `· ${tenant.phone}` : ''}</p>
        </div>
      </div>
    </div>
  );
};
