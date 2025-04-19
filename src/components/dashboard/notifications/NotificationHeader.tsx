
import { useLocale } from "@/components/providers/LocaleProvider";

export const NotificationHeader = () => {
  const { t } = useLocale();
  
  return (
    <div className="flex items-center px-3 py-2">
      <h4 className="font-medium text-sm">{t('notificationCenter')}</h4>
    </div>
  );
};
