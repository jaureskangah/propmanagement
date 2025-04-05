
import type { StyleDictionary } from "pdfmake/build/pdfmake";
import { getDefaultStyles } from "./pdfStyles";

/**
 * Options for PDF document generation
 */
export interface PdfOptions {
  title?: string;
  author?: string;
  headerText?: string;
  footerText?: string;
  showPageNumbers?: boolean;
  showDate?: boolean;
  dateFormat?: string;
  styles?: StyleDictionary;
}

/**
 * Get merged options combining defaults with user-provided options
 * @param options User-provided options
 * @returns Complete options object
 */
export const getMergedOptions = (options: PdfOptions = {}): PdfOptions => {
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
  
  // Merge default styles with any custom styles
  const defaultStyles = getDefaultStyles();
  const mergedStyles = { ...defaultStyles, ...(options.styles || {}) };
  
  return { 
    ...defaultOptions, 
    ...options,
    styles: mergedStyles
  };
};
