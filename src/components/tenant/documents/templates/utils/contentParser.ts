
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
    const f = (typeof field === 'string' ? field : String(field)).trim();

    // Handle common aliases and special computed fields first
    if (f === 'properties.name') {
      const anyData: any = data as any;

      // Try generic path resolution first (handles nested objects/arrays)
      try {
        const parts = f.split('.');
        let val: any = anyData;
        for (const part of parts) {
          if (Array.isArray(val)) val = val[0];
          if (val && typeof val === 'object' && part in val) {
            val = (val as any)[part];
          } else {
            val = undefined;
            break;
          }
        }
        if (val !== undefined && val !== null) {
          return String(val);
        }
      } catch {}

      // Fallbacks: handle object/array shapes and common aliases
      let name: string | undefined;

      if (anyData?.properties) {
        const props = anyData.properties;
        if (Array.isArray(props) && props.length > 0) {
          const first = props[0];
          if (first && typeof first === 'object' && 'name' in first) {
            name = String((first as any).name ?? '');
          }
        } else if (typeof props === 'object' && 'name' in props) {
          name = String((props as any).name ?? '');
        }
      }

      if (name === undefined && typeof anyData?.property_name === 'string') {
        name = anyData.property_name;
      }
      if (name === undefined && typeof anyData?.propertyName === 'string') {
        name = anyData.propertyName;
      }

      return name !== undefined && name !== null ? String(name) : match;
    }

    // Traitement des champs imbriqués (ex: properties.name)
    if (f.includes('.')) {
      const parts = f.split('.');
      let value: any = data;
      
      for (const part of parts) {
        // If we encounter arrays along the path, use the first element by default
        if (Array.isArray(value)) {
          value = value[0];
        }
        if (value && typeof value === 'object' && part in value) {
          value = (value as any)[part];
        } else {
          return match; // Si le champ n'existe pas, on laisse le texte original
        }
      }
      
      return value !== null && value !== undefined ? String(value) : match;
    }
    
    // Cas spéciaux
    if (f === 'currentDate') {
      return new Date().toLocaleDateString();
    }
    
    // Champs directs
    const value = (data as any)[f as keyof typeof data];
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
