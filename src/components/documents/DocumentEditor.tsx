
import { useRef, useState, useEffect } from "react";
import { useEditorState } from "./editor/useEditorState";
import { AIAssistantDialog } from "./editor/AIAssistantDialog";
import { ShareDocumentDialog } from "./editor/ShareDocumentDialog";
import { SaveTemplateDialog } from "./editor/SaveTemplateDialog";
import { SignatureDialog } from "./editor/SignatureDialog";
import { EditorToolbar } from "./editor/EditorToolbar";
import { DocumentTextarea } from "./editor/DocumentTextarea";
import { FormatToolbar } from "./editor/FormatToolbar";
import { useTenantData } from "../tenant/documents/hooks/useTenantData";

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
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isAdvancedEditingEnabled, setIsAdvancedEditingEnabled] = useState(false);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get tenant data for dynamic fields
  const { tenant } = useTenantData();

  // Effect for real-time preview
  useEffect(() => {
    // Cancel any existing timeout
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    
    // Only generate preview if we have content and aren't already generating
    if (content && !isGenerating) {
      // Set a delay before generating preview to avoid too many calls
      previewTimeoutRef.current = setTimeout(() => {
        console.log("Auto-generating preview after content change");
        onGeneratePreview(content);
      }, 1500); // 1.5 second delay
    }
    
    // Cleanup
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [content, isGenerating, onGeneratePreview]);

  const handleGeneratePreview = () => {
    // Clear any pending automatic preview
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
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
        const newPosition = start + text.length;
        textarea.setSelectionRange(newPosition, newPosition);
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
  
  // Process dynamic fields
  const insertDynamicField = (fieldCode: string) => {
    let replacedText = fieldCode;
    
    // Process the field if we're using the textarea's insertAtCursor method
    if (textareaRef.current && (textareaRef.current as any).insertTextAtCursor) {
      (textareaRef.current as any).insertTextAtCursor(replacedText);
      return;
    }
    
    // Fallback to regular insertion
    insertTextAtCursor(replacedText);
  };
  
  // Process content and replace dynamic fields with actual values
  const processContent = (inputContent: string): string => {
    if (!tenant) return inputContent;
    
    let processedContent = inputContent;
    
    // Replace date
    processedContent = processedContent.replace(/{{currentDate}}/g, new Date().toLocaleDateString());
    
    // Replace tenant fields
    processedContent = processedContent.replace(/{{tenant\.name}}/g, tenant.name || '');
    processedContent = processedContent.replace(/{{tenant\.email}}/g, tenant.email || '');
    processedContent = processedContent.replace(/{{tenant\.phone}}/g, tenant.phone || '');
    processedContent = processedContent.replace(/{{tenant\.unit_number}}/g, tenant.unit_number || '');
    processedContent = processedContent.replace(/{{tenant\.lease_start}}/g, tenant.lease_start || '');
    processedContent = processedContent.replace(/{{tenant\.lease_end}}/g, tenant.lease_end || '');
    processedContent = processedContent.replace(/{{tenant\.rent_amount}}/g, tenant.rent_amount?.toString() || '');
    
    // Replace property fields
    if (tenant.properties) {
      processedContent = processedContent.replace(/{{property\.name}}/g, tenant.properties.name || '');
    }
    
    return processedContent;
  };
  
  // Process dynamic fields before generating preview
  useEffect(() => {
    const originalHandleGeneratePreview = handleGeneratePreview;
    
    // Override the handleGeneratePreview function to process content
    const overriddenHandleGeneratePreview = () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
      const processedContent = processContent(content);
      onGeneratePreview(processedContent);
    };
    
    // Replace the function
    handleGeneratePreview = overriddenHandleGeneratePreview;
    
    return () => {
      // Restore the original function when component unmounts
      handleGeneratePreview = originalHandleGeneratePreview;
    };
  }, [content, tenant]);

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
    </div>
  );
}
