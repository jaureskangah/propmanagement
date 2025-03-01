
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DeadlineInfoProps {
  deadline?: string;
}

export const DeadlineInfo = ({ deadline }: DeadlineInfoProps) => {
  const { t } = useLocale();

  if (!deadline) return null;

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-gray-500" />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">{t('deadline')}:</span> {formatDate(deadline)}
      </span>
    </div>
  );
};
