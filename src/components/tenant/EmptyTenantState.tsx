
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card } from "@/components/ui/card";
import { UsersRound } from "lucide-react";

export const EmptyTenantState = () => {
  const { t } = useLocale();
  
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <UsersRound className="h-12 w-12 text-muted-foreground/60 mb-4" />
      <h3 className="text-lg font-medium mb-2">{t('noTenants')}</h3>
      <p className="text-muted-foreground text-sm max-w-md">
        {t('noTenantsFiltered')}
      </p>
    </Card>
  );
};
