
import type { Content } from "pdfmake/build/pdfmake";
import type { TenantData } from "@/components/tenant/documents/hooks/useTenantData";

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

/**
 * Processes dynamic fields in a document content by replacing placeholders with tenant data
 * @param content The document content with placeholders
 * @param tenant The tenant data to use for replacements
 * @returns The processed content with replaced placeholders
 */
export const processDynamicFields = (content: string, tenant: TenantData): string => {
  if (!tenant || !content) return content;
  
  let processedContent = content;
  
  // Replace tenant name
  processedContent = processedContent.replace(/\{tenant\.name\}/g, tenant.name || '');
  
  // Replace tenant email
  processedContent = processedContent.replace(/\{tenant\.email\}/g, tenant.email || '');
  
  // Replace tenant phone
  processedContent = processedContent.replace(/\{tenant\.phone\}/g, tenant.phone || '');
  
  // Replace tenant lease start date
  processedContent = processedContent.replace(/\{tenant\.lease_start\}/g, tenant.lease_start || '');
  
  // Replace tenant lease end date
  processedContent = processedContent.replace(/\{tenant\.lease_end\}/g, tenant.lease_end || '');
  
  // Replace tenant rent amount
  processedContent = processedContent.replace(
    /\{tenant\.rent_amount\}/g, 
    tenant.rent_amount ? tenant.rent_amount.toString() : ''
  );
  
  // Replace tenant unit number
  processedContent = processedContent.replace(/\{tenant\.unit_number\}/g, tenant.unit_number || '');
  
  // Replace property name if available
  if (tenant.properties) {
    processedContent = processedContent.replace(
      /\{property\.name\}/g,
      tenant.properties.name || ''
    );
    
    // Replace property address if available
    processedContent = processedContent.replace(
      /\{property\.address\}/g,
      tenant.properties.address || ''
    );
  }
  
  return processedContent;
};
