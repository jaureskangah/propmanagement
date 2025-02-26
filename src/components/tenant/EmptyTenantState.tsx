
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const EmptyTenantState = () => {
  const { t } = useLocale();
  
  return (
    <Card className="p-8 text-center space-y-4 animate-fade-in">
      <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
        <UserPlus className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{t('noTenants')}</h3>
      <p className="text-muted-foreground">
        {t('tenantsSubtitle')}
      </p>
    </Card>
  );
};
