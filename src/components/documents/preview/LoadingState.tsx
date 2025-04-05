
import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function LoadingState() {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md p-4 bg-background dark:bg-gray-800">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground text-center">
        {t('generatingPreview')}
      </p>
    </div>
  );
}
