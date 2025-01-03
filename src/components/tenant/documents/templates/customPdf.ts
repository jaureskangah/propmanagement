import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export const generateCustomPdf = async (content: string) => {
  const documentDefinition: TDocumentDefinitions = {
    content: [
      { text: content }
    ],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 12,
      lineHeight: 1.5
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    },
    fonts: {
      Roboto: {
        normal: 'Roboto-Regular',
        bold: 'Roboto-Medium',
        italics: 'Roboto-Italic',
        bolditalics: 'Roboto-MediumItalic'
      }
    }
  };

  return new Promise<Blob>((resolve, reject) => {
    try {
      console.log("Generating PDF with content:", content);
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator.getBlob((blob: Blob) => {
        console.log("PDF generated successfully");
        resolve(blob);
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};