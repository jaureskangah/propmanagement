
import { AlertTriangle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function DocumentTip() {
  const { t } = useLocale();
  
  return (
    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start dark:bg-blue-900/30 dark:border-blue-800">
      <div className="mr-2 mt-1">
        <AlertTriangle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('documentTip')}</h4>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          {t('documentTipDescription')}
        </p>
      </div>
    </div>
  );
}
