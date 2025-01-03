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

  return new Promise<Blob>((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      
      // Utiliser getBuffer au lieu de getBlob pour un meilleur contrôle
      pdfDocGenerator.getBuffer((buffer: ArrayBuffer) => {
        // Créer un Blob à partir du buffer avec le type MIME correct
        const pdfBlob = new Blob([buffer], { 
          type: 'application/pdf'
        });
        
        console.log("PDF generated successfully");
        console.log("PDF blob size:", pdfBlob.size);
        console.log("PDF blob type:", pdfBlob.type);
        
        resolve(pdfBlob);
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};