
import { Tenant } from "@/types/tenant";
import {
  AIAssistantDialog,
  ShareDocumentDialog,
  SaveTemplateDialog,
  SignatureDialog
} from "./dialogs";

interface DialogManagerProps {
  isAIDialogOpen: boolean;
  setIsAIDialogOpen: (isOpen: boolean) => void;
  isShareDialogOpen: boolean;
  setIsShareDialogOpen: (isOpen: boolean) => void;
  isSaveTemplateDialogOpen: boolean;
  setIsSaveTemplateDialogOpen: (isOpen: boolean) => void;
  isSignatureDialogOpen: boolean;
  setIsSignatureDialogOpen: (isOpen: boolean) => void;
  content: string;
  onContentChange: (content: string) => void;
  onInsertSignature: (signatureDataUrl: string) => void;
  templateName?: string;
  tenant?: Tenant | null;
  onOpenSaveTemplateDialog?: () => void;
}

export function DialogManager({
  isAIDialogOpen,
  setIsAIDialogOpen,
  isShareDialogOpen,
  setIsShareDialogOpen,
  isSaveTemplateDialogOpen,
  setIsSaveTemplateDialogOpen,
  isSignatureDialogOpen,
  setIsSignatureDialogOpen,
  content,
  onContentChange,
  onInsertSignature,
  templateName = "",
  onOpenSaveTemplateDialog
}: DialogManagerProps) {
  // Gérer la fermeture des différents dialogues
  const handleCloseAIDialog = () => setIsAIDialogOpen(false);
  const handleCloseShareDialog = () => setIsShareDialogOpen(false);
  const handleCloseSaveTemplateDialog = () => setIsSaveTemplateDialogOpen(false);
  const handleCloseSignatureDialog = () => setIsSignatureDialogOpen(false);

  return (
    <>
      {/* AI Assistant Dialog */}
      <AIAssistantDialog 
        isOpen={isAIDialogOpen}
        onClose={handleCloseAIDialog}
        onGenerate={onContentChange}
        content={content}
        templateName={templateName}
      />

      {/* Share Document Dialog */}
      <ShareDocumentDialog
        isOpen={isShareDialogOpen}
        onClose={handleCloseShareDialog}
        content={content}
        templateName={templateName}
      />
      
      {/* Save Template Dialog - Only shown if not using parent's dialog */}
      {!onOpenSaveTemplateDialog && (
        <SaveTemplateDialog
          isOpen={isSaveTemplateDialogOpen}
          onClose={handleCloseSaveTemplateDialog}
          content={content}
          templateName={templateName}
        />
      )}
      
      {/* Signature Dialog */}
      <SignatureDialog
        isOpen={isSignatureDialogOpen}
        onClose={handleCloseSignatureDialog}
        onSave={onInsertSignature}
      />
    </>
  );
}
