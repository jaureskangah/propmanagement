
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./preview/EmptyState";
import { ErrorState } from "./preview/ErrorState";
import { LoadingState } from "./preview/LoadingState";
import { PdfViewer } from "./preview/PdfViewer";
import { ActionButtons } from "./preview/ActionButtons";

interface DocumentPreviewProps {
  previewUrl: string | null;
  isGenerating: boolean;
  documentContent: string;
  templateName: string;
  onShare: () => void;
  previewError: string | null;
  onDownload?: () => void;
}

export function DocumentPreview({ 
  previewUrl, 
  isGenerating, 
  documentContent, 
  templateName,
  onShare,
  previewError,
  onDownload
}: DocumentPreviewProps) {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-col h-full min-h-[500px] gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">{t('preview')}</h2>
        <ActionButtons 
          onDownload={onDownload}
          onShare={onShare}
        />
      </div>
      
      <Card className="flex-1 overflow-hidden p-0 relative border">
        {isGenerating ? (
          <LoadingState />
        ) : previewError ? (
          <ErrorState 
            onRetry={() => {}} 
            errorMessage={previewError} 
          />
        ) : previewUrl ? (
          <PdfViewer 
            pdfUrl={previewUrl} 
            onError={() => {}} 
          />
        ) : (
          <EmptyState />
        )}
      </Card>
    </div>
  );
}
