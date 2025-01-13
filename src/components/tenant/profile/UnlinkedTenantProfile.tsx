import { Card } from "@/components/ui/card";
import { LinkTenantProfile } from "./LinkTenantProfile";
import type { Tenant } from "@/types/tenant";

interface UnlinkedTenantProfileProps {
  tenant: Tenant;
  onProfileLinked: () => void;
}

export const UnlinkedTenantProfile = ({ tenant, onProfileLinked }: UnlinkedTenantProfileProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome {tenant.name}</h2>
        <p className="text-muted-foreground mb-4">
          Link your profile to access your tenant portal
        </p>
        <LinkTenantProfile tenant={tenant} onProfileLinked={onProfileLinked} />
      </Card>
    </div>
  );
};