import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export const generateCustomPdf = async (content: string) => {
  console.log("Generating PDF with content:", content);
  
  const documentDefinition: TDocumentDefinitions = {
    content: [
      { text: content, lineHeight: 1.5 }
    ],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 12
    },
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40]
  };

  return new Promise<Blob>((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator.getBlob((blob: Blob) => {
        // Ensure we're creating a PDF blob with the correct MIME type
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        console.log("PDF generated successfully, blob size:", pdfBlob.size);
        resolve(pdfBlob);
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};