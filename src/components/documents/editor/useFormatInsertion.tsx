
import { useRef } from "react";

interface UseFormatInsertionProps {
  content: string;
  onContentChange: (content: string) => void;
}

/**
 * Hook pour gérer l'insertion de contenu formaté dans l'éditeur de document
 */
export function useFormatInsertion({ content, onContentChange }: UseFormatInsertionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      
      let newText;
      if (selectedText) {
        // Si du texte est sélectionné, l'entourer avec le format
        if (text === "**text**") {
          newText = content.substring(0, start) + "**" + selectedText + "**" + content.substring(end);
        } else if (text === "*text*") {
          newText = content.substring(0, start) + "*" + selectedText + "*" + content.substring(end);
        } else {
          newText = content.substring(0, start) + text + content.substring(end);
        }
      } else {
        // Si aucun texte n'est sélectionné, insérer simplement le format
        newText = content.substring(0, start) + text + content.substring(end);
      }
      
      onContentChange(newText);
      
      // Définir la position du curseur après le texte inséré
      setTimeout(() => {
        textarea.focus();
        if (selectedText) {
          // Si du texte était sélectionné, conserver la sélection avec le formatage
          const newSelectionStart = start + (text === "**text**" || text === "*text*" ? 2 : 0);
          const newSelectionEnd = end + (text === "**text**" || text === "*text*" ? 2 : 0);
          textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
        } else {
          // Si pas de sélection, positionner le curseur après le texte inséré
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

  return {
    textareaRef,
    insertTextAtCursor,
    insertImageTag,
    insertTable,
    insertSignature,
    insertDynamicField,
  };
}

/**
 * Crée le markdown pour un tableau
 */
export function createTableMarkdown(rows: number, cols: number) {
  let markdown = "\n";
  
  // Ligne d'en-tête
  markdown += "|";
  for (let i = 0; i < cols; i++) {
    markdown += ` Column ${i + 1} |`;
  }
  markdown += "\n";
  
  // Ligne de séparation
  markdown += "|";
  for (let i = 0; i < cols; i++) {
    markdown += " --- |";
  }
  markdown += "\n";
  
  // Lignes de données
  for (let i = 0; i < rows - 1; i++) {
    markdown += "|";
    for (let j = 0; j < cols; j++) {
      markdown += `  |`;
    }
    markdown += "\n";
  }
  
  return markdown + "\n";
}
