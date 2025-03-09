
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SecuritySection() {
  const { t } = useLocale();
  
  return (
    <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-50" />
      <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-green-400 to-emerald-500" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Lock className="h-5 w-5" />
          </div>
          {t('security')}
        </CardTitle>
        <CardDescription className="text-sm opacity-75">
          {t('securityDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative pb-6">
        <div className="rounded-lg bg-white/60 p-4 text-center shadow-sm">
          <p className="mb-4 text-sm text-slate-600">
            {t('securityChangePasswordDescription') || "Update your password to ensure account security"}
          </p>
          <ChangePasswordDialog />
        </div>
      </CardContent>
    </Card>
  );
}
