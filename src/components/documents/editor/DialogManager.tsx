
import { ReactNode } from "react";
import { AIAssistantDialog } from "./AIAssistantDialog";
import { ShareDocumentDialog } from "./ShareDocumentDialog";
import { SaveTemplateDialog } from "./SaveTemplateDialog";
import { SignatureDialog } from "./SignatureDialog";
import { Tenant } from "@/types/tenant";

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
  return (
    <>
      {/* AI Assistant Dialog */}
      <AIAssistantDialog 
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onGenerate={onContentChange}
        content={content}
        templateName={templateName}
      />

      {/* Share Document Dialog */}
      <ShareDocumentDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        content={content}
        templateName={templateName}
      />
      
      {/* Save Template Dialog - Only shown if not using parent's dialog */}
      {!onOpenSaveTemplateDialog && (
        <SaveTemplateDialog
          isOpen={isSaveTemplateDialogOpen}
          onClose={() => setIsSaveTemplateDialogOpen(false)}
          content={content}
          templateName={templateName}
        />
      )}
      
      {/* Signature Dialog */}
      <SignatureDialog
        isOpen={isSignatureDialogOpen}
        onClose={() => setIsSignatureDialogOpen(false)}
        onSave={onInsertSignature}
      />
    </>
  );
}
