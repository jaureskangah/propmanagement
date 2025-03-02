
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkTenantProfile } from "./LinkTenantProfile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, LinkIcon } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Tenant } from "@/types/tenant";

interface UnlinkedTenantProfileProps {
  tenant: Tenant;
  onProfileLinked: () => void;
}

export const UnlinkedTenantProfile = ({ tenant, onProfileLinked }: UnlinkedTenantProfileProps) => {
  const [linkingStatus, setLinkingStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const { t } = useLocale();

  const handleProfileLinked = (success: boolean, message: string) => {
    setLinkingStatus({ success, message });
    if (success) {
      onProfileLinked();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('notLinkedToTenant')}</CardTitle>
          <CardDescription className="text-base">
            {t('linkAccountRequired')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkingStatus.message && (
            <Alert variant={linkingStatus.success ? "default" : "destructive"} className="mb-6">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{linkingStatus.message}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <LinkIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{tenant.name}</h3>
              <p className="text-sm text-muted-foreground">{tenant.email}</p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6">
            {t('contactManager')}
          </p>
          
          <LinkTenantProfile 
            tenant={tenant} 
            onProfileLinked={handleProfileLinked} 
          />
        </CardContent>
      </Card>
    </div>
  );
};
