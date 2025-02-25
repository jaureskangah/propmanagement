
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SecuritySection() {
  const { t } = useLocale();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          {t('security')}
        </CardTitle>
        <CardDescription>
          {t('securityDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordDialog />
      </CardContent>
    </Card>
  );
}
