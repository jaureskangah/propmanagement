
import { RefObject } from "react";

/**
 * Utility functions for handling text formatting in the document editor
 */
export function useFormatHelpers(
  textareaRef: RefObject<HTMLTextAreaElement>,
  content: string, 
  onContentChange: (content: string) => void
) {
  // Insert text at cursor position
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

  // Insert image into document
  const insertImageTag = (imageUrl: string) => {
    if (!imageUrl) return;
    
    const imageMarkdown = `\n![Image](${imageUrl})\n`;
    insertTextAtCursor(imageMarkdown);
  };

  // Create markdown table structure
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

  // Insert table into document
  const insertTable = (rows: number, cols: number) => {
    const tableMarkdown = createTableMarkdown(rows, cols);
    insertTextAtCursor(tableMarkdown);
  };

  // Insert signature into document
  const insertSignature = (signatureDataUrl: string) => {
    if (!signatureDataUrl) return;
    
    const signatureMarkdown = `\n![Signature](${signatureDataUrl})\n`;
    insertTextAtCursor(signatureMarkdown);
  };
  
  // Insert dynamic field
  const insertDynamicField = (fieldCode: string) => {
    // Process the field if we're using the textarea's insertAtCursor method
    if (textareaRef.current && (textareaRef.current as any).insertTextAtCursor) {
      (textareaRef.current as any).insertTextAtCursor(fieldCode);
      return;
    }
    
    // Fallback to regular insertion
    insertTextAtCursor(fieldCode);
  };

  return {
    insertTextAtCursor,
    insertImageTag,
    insertTable,
    insertSignature,
    insertDynamicField
  };
}
