
import { Calendar } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatDate } from "@/lib/utils";

interface DeadlineInfoProps {
  deadline?: string;
}

export const DeadlineInfo = ({ deadline }: DeadlineInfoProps) => {
  const { t, language } = useLocale();

  if (!deadline) return null;
  
  const formattedDate = formatDate(deadline, language);

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-gray-500" />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">{t('deadline')}:</span> {formattedDate}
      </span>
    </div>
  );
};
