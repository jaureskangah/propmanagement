
import { Button } from "@/components/ui/button";
import { Download, Save, Share2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => void;
  onDownload: () => void;
  onShare?: () => void;
  isSaving: boolean;
  isDownloading: boolean;
  onSaveToHistory?: () => void;
  isSavingToHistory?: boolean;
}

export function ActionButtons({
  onSave,
  onDownload,
  onShare,
  isSaving,
  isDownloading,
  onSaveToHistory,
  isSavingToHistory
}: ActionButtonsProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap justify-between">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('saving')}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t('saveDocument')}
            </>
          )}
        </Button>
        {onSaveToHistory && (
          <Button
            onClick={onSaveToHistory}
            disabled={isSavingToHistory}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSavingToHistory ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('savingToHistory')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t('saveToHistory')}
              </>
            )}
          </Button>
        )}
        {onShare && (
          <Button
            onClick={onShare}
            variant="outline"
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            {t('shareDocument')}
          </Button>
        )}
      </div>
      <Button
        onClick={onDownload}
        disabled={isDownloading}
        className="gap-2 bg-green-600 hover:bg-green-700 text-white"
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('downloading')}
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            {t('downloadDocument')}
          </>
        )}
      </Button>
    </div>
  );
}
