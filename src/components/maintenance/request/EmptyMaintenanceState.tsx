
import { Wrench } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const EmptyMaintenanceState = () => {
  const { t } = useLocale();

  return (
    <div className="text-center py-8 border-2 border-dashed rounded-lg">
      <Wrench className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        {t('noMaintenanceRequests')}
      </p>
    </div>
  );
};
