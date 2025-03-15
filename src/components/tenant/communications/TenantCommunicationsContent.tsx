
import { Card, CardContent } from "@/components/ui/card";
import { Communication } from "@/types/tenant";
import { TenantCommunications } from "@/components/tenant/TenantCommunications";

interface TenantCommunicationsContentProps {
  communications: Communication[];
  onCreateCommunication: (subject: string, content: string, category?: string) => Promise<boolean>;
  onCommunicationUpdate: () => void;
  onToggleStatus: (comm: Communication) => void;
  onDeleteCommunication: (comm: Communication) => void;
  tenant?: { email: string; name: string } | null;
  isTenant?: boolean;
}

export const TenantCommunicationsContent = ({
  communications,
  onCreateCommunication,
  onCommunicationUpdate,
  onToggleStatus,
  onDeleteCommunication,
  tenant,
  isTenant = false
}: TenantCommunicationsContentProps) => {
  const tenantId = communications.length > 0 ? communications[0].tenant_id : undefined;

  return (
    <Card className="shadow-sm bg-background">
      <CardContent className="p-0">
        <TenantCommunications
          communications={communications}
          tenantId={tenantId || ""}
          onCommunicationUpdate={onCommunicationUpdate}
          tenant={tenant}
          onToggleStatus={onToggleStatus}
          onDeleteCommunication={onDeleteCommunication}
          isTenant={isTenant}
        />
      </CardContent>
    </Card>
  );
};
