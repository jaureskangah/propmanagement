
import { FC } from "react";
import { AIAssistantDialog } from "./AIAssistantDialog";
import { ShareDocumentDialog } from "./ShareDocumentDialog";
import { SaveTemplateDialog } from "./SaveTemplateDialog";
import { SignatureDialog } from "./SignatureDialog";

interface EditorDialogManagerProps {
  isAIDialogOpen: boolean;
  setIsAIDialogOpen: (value: boolean) => void;
  isShareDialogOpen: boolean;
  setIsShareDialogOpen: (value: boolean) => void;
  isSaveTemplateDialogOpen: boolean;
  setIsSaveTemplateDialogOpen: (value: boolean) => void;
  isSignatureDialogOpen: boolean;
  setIsSignatureDialogOpen: (value: boolean) => void;
  onContentChange: (content: string) => void;
  content: string;
  templateName: string;
  insertSignature: (signatureDataUrl: string) => void;
}

export const EditorDialogManager: FC<EditorDialogManagerProps> = ({
  isAIDialogOpen,
  setIsAIDialogOpen,
  isShareDialogOpen,
  setIsShareDialogOpen,
  isSaveTemplateDialogOpen,
  setIsSaveTemplateDialogOpen,
  isSignatureDialogOpen,
  setIsSignatureDialogOpen,
  onContentChange,
  content,
  templateName,
  insertSignature
}) => {
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
      
      {/* Save Template Dialog */}
      <SaveTemplateDialog
        isOpen={isSaveTemplateDialogOpen}
        onClose={() => setIsSaveTemplateDialogOpen(false)}
        content={content}
        templateName={templateName}
      />
      
      {/* Signature Dialog */}
      <SignatureDialog
        isOpen={isSignatureDialogOpen}
        onClose={() => setIsSignatureDialogOpen(false)}
        onSave={insertSignature}
      />
    </>
  );
};
