
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkTenantProfile } from "./LinkTenantProfile";
import type { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";

interface UnlinkedTenantProfileProps {
  tenant: Tenant;
  onProfileLinked: () => void;
}

export const UnlinkedTenantProfile = ({ tenant, onProfileLinked }: UnlinkedTenantProfileProps) => {
  const { t } = useLocale();
  
  return (
    <Card className="shadow-md dark:bg-gray-900">
      <CardHeader>
        <CardTitle>{t('notLinkedToTenant')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{t('linkAccountRequired')}</p>
        <p className="text-muted-foreground mb-6">{t('contactManager')}</p>
        
        <div className="flex justify-center">
          <LinkTenantProfile 
            tenant={tenant} 
            onProfileLinked={(success) => {
              if (success) onProfileLinked();
            }} 
          />
        </div>
      </CardContent>
    </Card>
  );
};
