
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaseStatusCard } from "../dashboard/LeaseStatusCard";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import { Calendar } from "lucide-react";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";

interface TenantLeaseStatusSectionProps {
  tenant: TenantData;
  leaseStatus: { daysLeft: number; status: 'active' | 'expiring' | 'expired' };
}

export const TenantLeaseStatusSection = ({ 
  tenant, 
  leaseStatus 
}: TenantLeaseStatusSectionProps) => {
  const { t } = useSafeTranslation();

  // Only show if tenant has lease data
  if (!tenant.lease_start || !tenant.lease_end) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t('leaseStatus', 'Statut du bail')}</h2>
      </div>
      
      <LeaseStatusCard
        leaseStart={tenant.lease_start}
        leaseEnd={tenant.lease_end}
        daysLeft={leaseStatus.daysLeft}
        status={leaseStatus.status}
      />
    </div>
  );
};
