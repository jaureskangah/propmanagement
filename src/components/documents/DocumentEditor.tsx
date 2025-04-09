
import { ReactNode } from "react";
import { useEditorState } from "./editor/useEditorState";
import { useEditorDialogs } from "./editor/useEditorDialogs";
import { useFormatInsertion } from "./editor/useFormatInsertion";
import { EditorToolbar } from "./editor/EditorToolbar";
import { EditorContent } from "./editor/EditorContent";
import { DialogManager } from "./editor/DialogManager";
import { Tenant } from "@/types/tenant";

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onGeneratePreview: (content: string) => void;
  isGenerating: boolean;
  templateName?: string;
  tenant?: Tenant | null;
  rightSlot?: ReactNode;
  onOpenSaveTemplateDialog?: () => void;
  onInsertDynamicField?: (field: string) => void;
}

export function DocumentEditor({
  content,
  onContentChange,
  onGeneratePreview,
  isGenerating,
  templateName = "",
  tenant = null,
  rightSlot,
  onOpenSaveTemplateDialog,
  onInsertDynamicField
}: DocumentEditorProps) {
  // Gestion de l'état de l'éditeur
  const { handleChange } = useEditorState(content, onContentChange);
  
  // Gestion des dialogues
  const { 
    isAIDialogOpen, setIsAIDialogOpen,
    isShareDialogOpen, setIsShareDialogOpen,
    isSaveTemplateDialogOpen, setIsSaveTemplateDialogOpen,
    isSignatureDialogOpen, setIsSignatureDialogOpen,
    isAdvancedEditingEnabled, setIsAdvancedEditingEnabled
  } = useEditorDialogs();
  
  // Gestion de l'insertion de contenu formaté
  const { 
    textareaRef, 
    insertTextAtCursor, 
    insertImageTag, 
    insertTable, 
    insertSignature, 
    insertDynamicField 
  } = useFormatInsertion({ content, onContentChange });

  // Gestionnaire pour la génération d'aperçu
  const handleGeneratePreview = () => {
    onGeneratePreview(content);
  };

  // Gestionnaire pour l'ouverture de la boîte de dialogue d'enregistrement de modèle
  const handleOpenSaveTemplateDialog = () => {
    if (onOpenSaveTemplateDialog) {
      onOpenSaveTemplateDialog();
    } else {
      setIsSaveTemplateDialogOpen(true);
    }
  };

  // Use the provided onInsertDynamicField if available, otherwise use the local function
  const handleInsertDynamicField = (field: string) => {
    if (onInsertDynamicField) {
      onInsertDynamicField(field);
    } else {
      insertDynamicField(field);
    }
  };

  return (
    <div className="space-y-4">
      <EditorContent 
        content={content}
        textareaRef={textareaRef}
        onChange={handleChange}
        onInsertFormat={insertTextAtCursor}
        onInsertImage={insertImageTag}
        onInsertTable={insertTable}
        onInsertSignature={() => setIsSignatureDialogOpen(true)}
        onInsertDynamicField={handleInsertDynamicField}
        isAdvancedEditingEnabled={isAdvancedEditingEnabled}
        rightSlot={rightSlot}
      />
      
      <EditorToolbar
        onOpenAIDialog={() => setIsAIDialogOpen(true)}
        onOpenShareDialog={() => setIsShareDialogOpen(true)}
        onOpenSaveTemplateDialog={handleOpenSaveTemplateDialog}
        onToggleAdvancedEditing={() => setIsAdvancedEditingEnabled(!isAdvancedEditingEnabled)}
        onGeneratePreview={handleGeneratePreview}
        isGenerating={isGenerating}
        hasContent={!!content}
        isAdvancedEditingEnabled={isAdvancedEditingEnabled}
      />

      <DialogManager 
        isAIDialogOpen={isAIDialogOpen}
        setIsAIDialogOpen={setIsAIDialogOpen}
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
        isSaveTemplateDialogOpen={isSaveTemplateDialogOpen}
        setIsSaveTemplateDialogOpen={setIsSaveTemplateDialogOpen}
        isSignatureDialogOpen={isSignatureDialogOpen}
        setIsSignatureDialogOpen={setIsSignatureDialogOpen}
        content={content}
        onContentChange={onContentChange}
        onInsertSignature={insertSignature}
        templateName={templateName}
        onOpenSaveTemplateDialog={onOpenSaveTemplateDialog}
      />
    </div>
  );
}
