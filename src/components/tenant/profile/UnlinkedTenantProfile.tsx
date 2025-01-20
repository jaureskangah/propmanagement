import { Card } from "@/components/ui/card";
import { LinkTenantProfile } from "./LinkTenantProfile";
import type { Tenant } from "@/types/tenant";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface UnlinkedTenantProfileProps {
  tenant: Tenant;
  onProfileLinked: () => void;
}

export const UnlinkedTenantProfile = ({ tenant, onProfileLinked }: UnlinkedTenantProfileProps) => {
  const [linkingStatus, setLinkingStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const handleProfileLinked = (success: boolean, message: string) => {
    setLinkingStatus({ success, message });
    if (success) {
      onProfileLinked();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome {tenant.name}</h2>
        <p className="text-muted-foreground mb-4">
          Link your profile to access your tenant portal
        </p>
        {linkingStatus.message && (
          <Alert variant={linkingStatus.success ? "default" : "destructive"} className="mb-4">
            <AlertDescription>{linkingStatus.message}</AlertDescription>
          </Alert>
        )}
        <LinkTenantProfile 
          tenant={tenant} 
          onProfileLinked={handleProfileLinked} 
        />
      </Card>
    </div>
  );
};