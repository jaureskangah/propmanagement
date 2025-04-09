
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./preview/EmptyState";
import { ErrorState } from "./preview/ErrorState";
import { LoadingState } from "./preview/LoadingState";
import { PdfViewer } from "./preview/PdfViewer";
import { ActionButtons } from "./preview/ActionButtons";
import { useState } from "react";
import { ShareDocumentDialog } from "./editor/ShareDocumentDialog";
import { SignatureDialog } from "./editor/dialogs/SignatureDialog";
import { useToast } from "@/hooks/use-toast";

interface DocumentPreviewProps {
  previewUrl: string | null;
  isGenerating: boolean;
  documentContent: string;
  templateName: string;
  documentType?: string;
  onShare: () => void;
  previewError: string | null;
  onDownload?: () => void;
  onUpdatePreview?: (signedContent: string) => void;
}

export function DocumentPreview({ 
  previewUrl, 
  isGenerating, 
  documentContent, 
  templateName,
  documentType,
  onShare,
  previewError,
  onDownload,
  onUpdatePreview
}: DocumentPreviewProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  
  const handleShare = () => {
    setShareDialogOpen(true);
  };
  
  const handleSign = () => {
    setSignatureDialogOpen(true);
  };
  
  const handleSaveSignature = (signatureDataUrl: string) => {
    if (!onUpdatePreview) return;
    
    // Ajouter la signature au contenu du document
    const signedContent = documentContent + `\n\n\n[Signature]\n${signatureDataUrl}`;
    
    // Mettre à jour le document avec la signature
    onUpdatePreview(signedContent);
    
    // Afficher une notification
    toast({
      title: t('documentSigned') || "Document signé",
      description: t('signatureAdded') || "Votre signature a été ajoutée au document",
      variant: "default"
    });
  };
  
  return (
    <div className="flex flex-col h-full min-h-[500px] gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">{t('preview') || "Aperçu"}</h2>
        <ActionButtons 
          onDownload={onDownload}
          onShare={handleShare}
          onSign={onUpdatePreview ? handleSign : undefined}
          documentType={documentType}
        />
      </div>
      
      <Card className="flex-1 overflow-hidden p-0 relative bg-white border document-preview-container" 
        style={{ backgroundColor: "#ffffff" }}
        data-pdf-container="true">
        {isGenerating ? (
          <LoadingState />
        ) : previewError ? (
          <ErrorState 
            onRetry={() => {}} 
            errorMessage={previewError} 
          />
        ) : previewUrl ? (
          <div className="w-full h-full" style={{ backgroundColor: "#ffffff", minHeight: "500px" }}>
            <PdfViewer 
              pdfUrl={previewUrl} 
              onError={() => {
                console.log("DocumentPreview: PdfViewer error event fired");
              }} 
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </Card>
      
      <ShareDocumentDialog 
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        content={documentContent}
        templateName={templateName}
      />
      
      <SignatureDialog
        isOpen={signatureDialogOpen}
        onClose={() => setSignatureDialogOpen(false)}
        onSave={handleSaveSignature}
      />
    </div>
  );
}
