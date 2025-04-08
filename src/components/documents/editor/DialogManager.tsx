
import { useState } from "react";
import { ShareDocumentDialog } from "./dialogs/ShareDocumentDialog";
import { useTenantContext } from "@/components/providers/TenantProvider";
import { AIAssistantDialog, SaveTemplateDialog, SignatureDialog } from "./dialogs";

interface DialogManagerProps {
  editorContent: string;
  documentName?: string;
  handleInsertText: (text: string) => void;
}

export function DialogManager({ 
  editorContent, 
  documentName, 
  handleInsertText 
}: DialogManagerProps) {
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const { tenant } = useTenantContext();
  
  // Récupérer l'email du locataire s'il existe
  const tenantEmail = tenant?.email || "";

  return (
    <>
      <AIAssistantDialog 
        isOpen={aiDialogOpen} 
        onClose={() => setAiDialogOpen(false)} 
        onGenerate={handleInsertText}
        content={editorContent}
        templateName={documentName}
      />
      
      <ShareDocumentDialog 
        isOpen={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)} 
        content={editorContent}
        templateName={documentName}
        tenantEmail={tenantEmail}
      />
      
      <SaveTemplateDialog 
        isOpen={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)} 
        content={editorContent}
        templateName={documentName}
      />
      
      <SignatureDialog 
        isOpen={signatureDialogOpen} 
        onClose={() => setSignatureDialogOpen(false)} 
        onSave={handleInsertText}
      />
    </>
  );
}
