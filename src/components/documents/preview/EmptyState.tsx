
import { File } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function EmptyState() {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md p-4 bg-background dark:bg-gray-800">
      <div className="bg-muted/30 p-4 rounded-full mb-4">
        <File className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{t('documentGenerator.noPreviewAvailable')}</h3>
      <p className="text-muted-foreground text-center max-w-md">
        {t('documentGenerator.generatePreviewDescription')}
      </p>
    </div>
  );
}
