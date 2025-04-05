
import { DocumentHistory } from "./DocumentHistory";
import { useLocale } from "@/components/providers/LocaleProvider";

export function DocumentHistoryTab() {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('documentHistory')}</h2>
      <DocumentHistory />
    </div>
  );
}
