
import { useState } from "react";
import { Communication, Tenant } from "@/types/tenant";
import { TenantCommunications } from "../TenantCommunications";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantCommunicationsContentProps {
  communications: Communication[];
  onCreateCommunication: (data: {
    subject: string;
    content: string;
    category: string;
  }) => Promise<boolean>;
  onCommunicationUpdate: () => void;
  onToggleStatus: (comm: Communication) => void;
  onDeleteCommunication: (comm: Communication) => void;
  tenant?: Tenant | null;
}

export const TenantCommunicationsContent = ({
  communications,
  onCreateCommunication,
  onCommunicationUpdate,
  onToggleStatus,
  onDeleteCommunication,
  tenant
}: TenantCommunicationsContentProps) => {
  const { t } = useLocale();
  const [filteredCommunications, setFilteredCommunications] = useState<Communication[]>(communications);

  // We already have the TenantCommunications component
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('tenant.communications.communicationsHistory')}</h1>
      <p className="text-muted-foreground">{t('tenant.communications.communicationsDescription')}</p>
      
      <TenantCommunications
        communications={communications}
        tenantId={tenant?.id || ""}
        onCommunicationUpdate={onCommunicationUpdate}
        onToggleStatus={onToggleStatus}
        onDeleteCommunication={onDeleteCommunication}
        tenant={tenant ? { email: tenant.email, name: tenant.name } : null}
      />
    </div>
  );
};
