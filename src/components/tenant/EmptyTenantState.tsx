
import { UserRoundSearch } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const EmptyTenantState = () => {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/30 rounded-lg border-2 border-dashed">
      <UserRoundSearch className="h-12 w-12 text-muted-foreground/50" />
      <div>
        <h3 className="font-medium">{t('noTenants')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('noTenantsFiltered')}</p>
      </div>
    </div>
  );
};
