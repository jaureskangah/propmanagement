
import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
}

export const UploadProgress = ({ status, progress }: UploadProgressProps) => {
  const { t } = useLocale();

  if (status === 'idle') {
    return null;
  }

  return (
    <div className="space-y-2">
      {status === 'uploading' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("uploadingFile")}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{t("uploadComplete")}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{t("uploadFailed")}</span>
        </div>
      )}
    </div>
  );
};
