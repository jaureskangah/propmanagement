
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SecuritySection() {
  const { t } = useLocale();
  
  return (
    <Card className="transition-all duration-300 hover:shadow-md overflow-hidden border-border">
      <div className="h-1 bg-red-500" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
            <Lock className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
          {t('security')}
        </CardTitle>
        <CardDescription>
          {t('securityDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-4">
          <p className="font-medium text-sm text-muted-foreground">{t('passwordSecurity')}</p>
          <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
            {t('passwordSecurityDescription')}
          </p>
        </div>
        <ChangePasswordDialog />
      </CardContent>
    </Card>
  );
}
