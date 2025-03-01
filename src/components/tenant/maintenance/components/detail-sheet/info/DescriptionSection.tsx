
import { useLocale } from "@/components/providers/LocaleProvider";

interface DescriptionSectionProps {
  description?: string;
}

export const DescriptionSection = ({ description }: DescriptionSectionProps) => {
  const { t } = useLocale();

  if (!description) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
        {description}
      </p>
    </div>
  );
};
