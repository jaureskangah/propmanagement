import { useRef, useState } from "react";
import { useEditorState } from "./editor/useEditorState";
import { AIAssistantDialog } from "./editor/AIAssistantDialog";
import { ShareDocumentDialog } from "./editor/ShareDocumentDialog";
import { SaveTemplateDialog } from "./editor/SaveTemplateDialog";
import { SignatureDialog } from "./editor/SignatureDialog";
import { EditorToolbar } from "./editor/EditorToolbar";
import { DocumentTextarea } from "./editor/DocumentTextarea";
import { FormatToolbar } from "./editor/FormatToolbar";
import { Tenant } from "@/types/tenant";
import { ReactNode } from "react";

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onGeneratePreview: (content: string) => void;
  isGenerating: boolean;
  templateName?: string;
  tenant?: Tenant | null;
  rightSlot?: ReactNode;
  onOpenSaveTemplateDialog?: () => void;
}

export function DocumentEditor({
  content,
  onContentChange,
  onGeneratePreview,
  isGenerating,
  templateName = "",
  tenant = null,
  rightSlot,
  onOpenSaveTemplateDialog
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
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isAdvancedEditingEnabled, setIsAdvancedEditingEnabled] = useState(false);

  const handleGeneratePreview = () => {
    onGeneratePreview(content);
  };

  // Format insertion helpers
  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      
      let newText;
      if (selectedText) {
        // If text is selected, wrap it with the format
        if (text === "**text**") {
          newText = content.substring(0, start) + "**" + selectedText + "**" + content.substring(end);
        } else if (text === "*text*") {
          newText = content.substring(0, start) + "*" + selectedText + "*" + content.substring(end);
        } else {
          newText = content.substring(0, start) + text + content.substring(end);
        }
      } else {
        // If no text is selected, just insert the format
        newText = content.substring(0, start) + text + content.substring(end);
      }
      
      onContentChange(newText);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        if (selectedText) {
          // If text was selected, keep the selection with formatting
          const newSelectionStart = start + (text === "**text**" || text === "*text*" ? 2 : 0);
          const newSelectionEnd = end + (text === "**text**" || text === "*text*" ? 2 : 0);
          textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
        } else {
          // If no selection, set cursor position after inserted text
          const newPosition = start + text.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  const insertImageTag = (imageUrl: string) => {
    if (!imageUrl) return;
    
    const imageMarkdown = `\n![Image](${imageUrl})\n`;
    insertTextAtCursor(imageMarkdown);
  };

  const createTableMarkdown = (rows: number, cols: number) => {
    let markdown = "\n";
    
    // Header row
    markdown += "|";
    for (let i = 0; i < cols; i++) {
      markdown += ` Column ${i + 1} |`;
    }
    markdown += "\n";
    
    // Separator row
    markdown += "|";
    for (let i = 0; i < cols; i++) {
      markdown += " --- |";
    }
    markdown += "\n";
    
    // Data rows
    for (let i = 0; i < rows - 1; i++) {
      markdown += "|";
      for (let j = 0; j < cols; j++) {
        markdown += `  |`;
      }
      markdown += "\n";
    }
    
    return markdown + "\n";
  };

  const insertTable = (rows: number, cols: number) => {
    const tableMarkdown = createTableMarkdown(rows, cols);
    insertTextAtCursor(tableMarkdown);
  };

  const insertSignature = (signatureDataUrl: string) => {
    if (!signatureDataUrl) return;
    
    const signatureMarkdown = `\n![Signature](${signatureDataUrl})\n`;
    insertTextAtCursor(signatureMarkdown);
  };

  const insertDynamicField = (field: string) => {
    insertTextAtCursor(field);
  };

  const handleOpenSaveTemplateDialog = () => {
    if (onOpenSaveTemplateDialog) {
      onOpenSaveTemplateDialog();
    } else {
      setIsSaveTemplateDialogOpen(true);
    }
  };

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
      
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <DocumentTextarea
            ref={textareaRef}
            content={content}
            onChange={handleChange}
          />
        </div>
        {rightSlot && (
          <div className="mt-3">
            {rightSlot}
          </div>
        )}
      </div>
      
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
        onSave={insertSignature}
      />
    </div>
  );
}
