
import type { Content } from "pdfmake/build/pdfmake";
import { Tenant } from "@/types/tenant";

/**
 * Traite les champs dynamiques dans le texte, les remplaçant par les valeurs appropriées
 * @param content Contenu du texte avec des champs dynamiques sous forme de {{champ}}
 * @param data Données à utiliser pour remplacer les champs dynamiques
 * @returns Le contenu avec les champs remplacés par leurs valeurs
 */
export const processDynamicFields = (content: string, data?: Tenant | null): string => {
  if (!content || !data) return content;
  
  // Regex pour trouver les champs dynamiques de format {{champ}}
  const regex = /\{\{([^}]+)\}\}/g;
  
  return content.replace(regex, (match, field) => {
    // Traitement des champs imbriqués (ex: properties.name)
    if (field.includes('.')) {
      const parts = field.split('.');
      let value: any = data;
      
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part as keyof typeof value];
        } else {
          return match; // Si le champ n'existe pas, on laisse le texte original
        }
      }
      
      return value !== null && value !== undefined ? String(value) : match;
    }
    
    // Cas spéciaux
    if (field === 'currentDate') {
      return new Date().toLocaleDateString();
    }
    
    // Champs directs
    const value = data[field as keyof typeof data];
    return value !== null && value !== undefined ? String(value) : match;
  });
};

/**
 * Parses text content into structured sections for PDF generation
 * @param content The raw text content to parse
 * @returns An array of PDF content objects with appropriate styling
 */
export const parseContentIntoSections = (content: string): Content[] => {
  if (!content || content.trim() === '') {
    return [{ text: 'No content provided' }];
  }
  
  // Split content by lines
  const lines = content.split('\n');
  const result: Content[] = [];
  
  // Process each line to add appropriate styles
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (trimmedLine === '') {
      result.push({ text: ' ', margin: [0, 5, 0, 0] });
      return;
    }
    
    // Headers (ALL CAPS lines or lines ending with colon)
    if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3) {
      result.push({ 
        text: trimmedLine, 
        style: 'header',
        margin: [0, index === 0 ? 0 : 15, 0, 5]
      });
    }
    // Subheaders (lines ending with colon)
    else if (trimmedLine.endsWith(':')) {
      result.push({ 
        text: trimmedLine, 
        style: 'subheader',
        margin: [0, 10, 0, 5]
      });
    }
    // Lists (lines starting with - or *)
    else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
      result.push({
        ul: [{ text: trimmedLine.substring(1).trim() }]
      });
    }
    // Regular paragraph
    else {
      result.push({ text: trimmedLine });
    }
  });
  
  return result;
};
