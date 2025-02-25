
import { useLocale } from "@/components/providers/LocaleProvider";

export const MaintenanceHeader = () => {
  const { t } = useLocale();
  
  return (
    <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
      {t('maintenanceManagement')}
    </h1>
  );
};
