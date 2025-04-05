
import React, { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { ActionButtons } from "./preview/ActionButtons";
import { useDocumentPreview } from "./preview/useDocumentPreview";

interface DocumentPreviewProps {
  previewUrl: string | null;
  documentContent: string;
  templateName: string;
  isGenerating?: boolean; // Added this prop
  onShare?: () => void;   // Made this optional
  previewError?: string | null; // Made this optional
}

export function DocumentPreview({
  previewUrl,
  documentContent,
  templateName,
  isGenerating = false, // Provide default
  onShare,
  previewError = null
}: DocumentPreviewProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  
  const {
    isSaving,
    isDownloading,
    isSavingToHistory,
    loadError,
    setLoadError,
    handleDownload,
    handleSaveToSystem,
    handleSaveToHistory,
    handleRetryLoad
  } = useDocumentPreview({
    previewUrl,
    documentContent,
    templateName
  });

  const handleRetry = () => {
    handleRetryLoad();
    toast({
      title: t('templateLoaded'),
      description: t('templateLoadedDescription')
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('preview')}</h2>
      </div>
      
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <p className="text-gray-500">{t('generatingPreview')}</p>
        </div>
      ) : previewUrl && !loadError ? (
        <>
          <div className="h-[500px] border rounded-md overflow-hidden">
            <iframe 
              src={previewUrl} 
              className="w-full h-full" 
              onError={() => setLoadError(true)}
            />
          </div>
          
          <ActionButtons
            onSave={handleSaveToSystem}
            onDownload={handleDownload}
            isSaving={isSaving}
            isDownloading={isDownloading}
            onSaveToHistory={handleSaveToHistory}
            isSavingToHistory={isSavingToHistory}
            onShare={onShare}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          {loadError || previewError ? (
            <>
              <p className="text-red-500">{previewError || t('noPreviewAvailable')}</p>
              <button 
                onClick={handleRetry} 
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {t('generatePreview')}
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500">{t('noPreviewAvailable')}</p>
              <p className="text-gray-500">{t('generatePreviewDescription')}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
