
import React from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Save, Download, Clock, Share } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => void;
  onDownload: () => void;
  isSaving: boolean;
  isDownloading: boolean;
  onSaveToHistory: () => void;
  isSavingToHistory: boolean;
  onShare?: () => void;
}

export function ActionButtons({
  onSave,
  onDownload,
  isSaving,
  isDownloading,
  onSaveToHistory,
  isSavingToHistory,
  onShare
}: ActionButtonsProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        {isSaving ? t('saving') : t('saveDocument')}
      </Button>
      
      <Button
        variant="outline"
        onClick={onDownload}
        disabled={isDownloading}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isDownloading ? t('downloading') : t('downloadDocument')}
      </Button>
      
      <Button
        variant="outline"
        onClick={onSaveToHistory}
        disabled={isSavingToHistory}
        className="flex items-center gap-2"
      >
        <Clock className="h-4 w-4" />
        {isSavingToHistory ? t('savingToHistory') : t('saveToHistory')}
      </Button>
      
      {onShare && (
        <Button
          variant="outline"
          onClick={onShare}
          className="flex items-center gap-2"
        >
          <Share className="h-4 w-4" />
          {t('shareDocument')}
        </Button>
      )}
    </div>
  );
}
