
import { useState } from "react";
import { useEditorState } from "./editor/useEditorState";
import { EditorToolbar } from "./editor/EditorToolbar";
import { DocumentTextarea } from "./editor/DocumentTextarea";
import { FormatToolbar } from "./editor/FormatToolbar";
import { useTenantData } from "../tenant/documents/hooks/useTenantData";
import { useFormatHelpers } from "./editor/useFormatHelpers";
import { useDocumentProcessing } from "./editor/useDocumentProcessing";
import { EditorDialogManager } from "./editor/EditorDialogManager";

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onGeneratePreview: (content: string) => void;
  isGenerating: boolean;
  templateName?: string;
}

export function DocumentEditor({
  content,
  onContentChange,
  onGeneratePreview,
  isGenerating,
  templateName = ""
}: DocumentEditorProps) {
  // Editor state management
  const {
    isAIDialogOpen,
    setIsAIDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    textareaRef,
    handleChange
  } = useEditorState(content, onContentChange);
  
  // Additional dialog states
  const [isSaveTemplateDialogOpen, setIsSaveTemplateDialogOpen] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isAdvancedEditingEnabled, setIsAdvancedEditingEnabled] = useState(false);
  
  // Get tenant data for dynamic fields
  const { tenant } = useTenantData();
  
  // Document content processing and preview
  const { handleGeneratePreview } = useDocumentProcessing(
    content, 
    onGeneratePreview, 
    tenant, 
    isGenerating
  );
  
  // Text formatting helpers
  const {
    insertTextAtCursor,
    insertImageTag,
    insertTable,
    insertSignature,
    insertDynamicField
  } = useFormatHelpers(textareaRef, content, onContentChange);

  return (
    <div className="space-y-4">
      {isAdvancedEditingEnabled && (
        <FormatToolbar
          onInsertFormat={insertTextAtCursor}
          onInsertImage={insertImageTag}
          onInsertTable={insertTable}
          onInsertSignature={() => setIsSignatureDialogOpen(true)}
          onInsertDynamicField={insertDynamicField}
        />
      )}
      
      <DocumentTextarea
        ref={textareaRef}
        content={content}
        onChange={handleChange}
      />
      
      <EditorToolbar
        onOpenAIDialog={() => setIsAIDialogOpen(true)}
        onOpenShareDialog={() => setIsShareDialogOpen(true)}
        onOpenSaveTemplateDialog={() => setIsSaveTemplateDialogOpen(true)}
        onToggleAdvancedEditing={() => setIsAdvancedEditingEnabled(!isAdvancedEditingEnabled)}
        onGeneratePreview={handleGeneratePreview}
        isGenerating={isGenerating}
        hasContent={!!content}
        isAdvancedEditingEnabled={isAdvancedEditingEnabled}
      />

      <EditorDialogManager
        isAIDialogOpen={isAIDialogOpen}
        setIsAIDialogOpen={setIsAIDialogOpen}
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
        isSaveTemplateDialogOpen={isSaveTemplateDialogOpen}
        setIsSaveTemplateDialogOpen={setIsSaveTemplateDialogOpen}
        isSignatureDialogOpen={isSignatureDialogOpen}
        setIsSignatureDialogOpen={setIsSignatureDialogOpen}
        onContentChange={onContentChange}
        content={content}
        templateName={templateName}
        insertSignature={insertSignature}
      />
    </div>
  );
}
