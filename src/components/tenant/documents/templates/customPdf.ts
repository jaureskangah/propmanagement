
import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions, Content, StyleDictionary } from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

interface PdfOptions {
  title?: string;
  author?: string;
  headerText?: string;
  footerText?: string;
  showPageNumbers?: boolean;
  showDate?: boolean;
  dateFormat?: string;
  styles?: StyleDictionary;
}

export const generateCustomPdf = async (content: string, options: PdfOptions = {}) => {
  console.log("Generating PDF with content:", content);
  
  const defaultOptions: PdfOptions = {
    title: 'Generated Document',
    author: 'Property Management System',
    headerText: '',
    footerText: '© Property Management System',
    showPageNumbers: true,
    showDate: true,
    dateFormat: 'DD/MM/YYYY',
    styles: {}
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Format date for display
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate, mergedOptions.dateFormat);
  
  // Create header and footer
  const header = mergedOptions.headerText ? 
    (currentPage: number) => ({ 
      text: mergedOptions.headerText,
      alignment: 'center',
      margin: [40, 20, 40, 20] 
    }) : undefined;
    
  const footer = (currentPage: number, pageCount: number) => {
    const elements: Content[] = [];
    
    if (mergedOptions.showPageNumbers) {
      elements.push({
        text: `Page ${currentPage} / ${pageCount}`,
        alignment: 'right',
        margin: [0, 0, 40, 0]
      });
    }
    
    if (mergedOptions.footerText) {
      elements.push({
        text: mergedOptions.footerText,
        alignment: 'center',
        margin: [40, 10, 40, 0]
      });
    }
    
    return elements;
  };
  
  // Parse content into sections based on common document structure
  const contentSections = parseContentIntoSections(content);
  
  // Define default document styles
  const defaultStyles: StyleDictionary = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 10, 0, 5],
      color: '#2563eb'
    },
    subheader: {
      fontSize: 14,
      bold: true,
      margin: [0, 10, 0, 5],
      color: '#4b5563'
    },
    quote: {
      italics: true,
      margin: [20, 0, 20, 0],
      color: '#6b7280'
    },
    small: {
      fontSize: 8
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: '#1f2937'
    }
  };
  
  // Merge custom styles with default styles
  const combinedStyles = { ...defaultStyles, ...mergedOptions.styles };
  
  // Create document definition
  const documentDefinition: TDocumentDefinitions = {
    content: [
      // Add document title if provided
      mergedOptions.title ? {
        text: mergedOptions.title,
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      } : null,
      
      // Add date if requested
      mergedOptions.showDate ? {
        text: `Date: ${formattedDate}`,
        alignment: 'right',
        margin: [0, 0, 0, 20]
      } : null,
      
      // Add formatted content
      ...contentSections
    ],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 12,
      lineHeight: 1.5,
    },
    styles: combinedStyles,
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header,
    footer,
    info: {
      title: mergedOptions.title || 'Generated Document',
      author: mergedOptions.author || 'Property Management System',
      creator: 'PDFMake'
    }
  };

  return new Promise<Uint8Array>((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      
      pdfDocGenerator.getBuffer((buffer: Uint8Array) => {
        console.log("PDF buffer generated successfully, size:", buffer.byteLength);
        resolve(buffer);
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};

// Helper function to format date - Fixed TypeScript error
const formatDate = (date: Date, format: string = 'DD/MM/YYYY'): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString(); // Explicitly convert year to string
  
  // Fix: Use string literals for replacement to avoid TypeScript errors
  let result = format;
  result = result.replace(/DD/g, day);
  result = result.replace(/MM/g, month);
  result = result.replace(/YYYY/g, year.toString()); // Ensure year is a string
  
  return result;
};

// Helper function to parse content into styled sections
const parseContentIntoSections = (content: string): Content[] => {
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
