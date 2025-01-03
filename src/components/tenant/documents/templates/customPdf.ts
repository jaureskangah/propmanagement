import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export const generateCustomPdf = async (content: string) => {
  console.log("Generating PDF with content:", content);
  
  const documentDefinition: TDocumentDefinitions = {
    content: [
      {
        text: content,
        lineHeight: 1.5,
        preserveLeadingSpaces: true
      }
    ],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 12
    },
    pageSize: 'A4',
    pageMargins: [ 40, 60, 40, 60 ],
    info: {
      title: 'Generated Document',
      author: 'Property Management System',
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