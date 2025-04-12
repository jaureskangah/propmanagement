
import { BellRing } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const EmptyReminders = () => {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
      <BellRing className="h-10 w-10 mb-2 opacity-50" />
      <p>{t('noReminders')}</p>
    </div>
  );
};
