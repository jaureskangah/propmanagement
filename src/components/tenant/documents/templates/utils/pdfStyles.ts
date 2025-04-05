
import type { StyleDictionary } from "pdfmake/build/pdfmake";

/**
 * Default styles for PDF documents
 */
export const getDefaultStyles = (): StyleDictionary => {
  return {
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
};
