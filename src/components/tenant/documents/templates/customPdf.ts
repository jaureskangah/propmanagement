
import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions, Content } from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatDate } from "./utils/dateUtils";
import { parseContentIntoSections } from "./utils/contentParser";
import { PdfOptions, getMergedOptions } from "./utils/pdfOptions";

// Initialize pdfMake with fonts
(pdfMake as any).vfs = (pdfFonts as any).vfs;

/**
 * Generates a custom PDF document from text content
 * @param content The document content as text
 * @param options Configuration options for the PDF
 * @returns Promise resolving to a Uint8Array representing the PDF
 */
export const generateCustomPdf = async (content: string, options: PdfOptions = {}) => {
  console.log("Generating PDF with content:", content);
  
  // Get merged options with defaults
  const mergedOptions = getMergedOptions(options);
  
  // Format date for display if needed
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate, mergedOptions.dateFormat);
  
  // Create header function if headerText is provided
  const header = mergedOptions.headerText ? 
    (currentPage: number) => ({ 
      text: mergedOptions.headerText,
      alignment: 'center',
      margin: [40, 20, 40, 20] 
    }) : undefined;
  
  // Create footer function with page numbers and/or footer text
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
  
  // Parse content into sections
  const contentSections = parseContentIntoSections(content);
  
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
    styles: mergedOptions.styles,
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
