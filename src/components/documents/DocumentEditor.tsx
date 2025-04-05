
import { useRef, useState } from "react";
import { useEditorState } from "./editor/useEditorState";
import { AIAssistantDialog } from "./editor/AIAssistantDialog";
import { ShareDocumentDialog } from "./editor/ShareDocumentDialog";
import { SaveTemplateDialog } from "./editor/SaveTemplateDialog";
import { EditorToolbar } from "./editor/EditorToolbar";
import { DocumentTextarea } from "./editor/DocumentTextarea";

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
  const {
    isAIDialogOpen,
    setIsAIDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    textareaRef,
    handleChange
  } = useEditorState(content, onContentChange);
  
  const [isSaveTemplateDialogOpen, setIsSaveTemplateDialogOpen] = useState(false);

  const handleGeneratePreview = () => {
    onGeneratePreview(content);
  };

  return (
    <div className="space-y-4">
      <DocumentTextarea
        ref={textareaRef}
        content={content}
        onChange={handleChange}
      />
      
      <EditorToolbar
        onOpenAIDialog={() => setIsAIDialogOpen(true)}
        onOpenShareDialog={() => setIsShareDialogOpen(true)}
        onOpenSaveTemplateDialog={() => setIsSaveTemplateDialogOpen(true)}
        onGeneratePreview={handleGeneratePreview}
        isGenerating={isGenerating}
        hasContent={!!content}
      />

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
    </div>
  );
}
