import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/build/pdfmake";
import type { Tenant } from "@/types/tenant";
import { formatDate } from "@/lib/utils";

// Import fonts directly from the vfs_fonts file
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfMake with the fonts
(pdfMake as any).vfs = (pdfFonts as any).vfs;

export const generateRentalReceipt = async (tenant: Tenant) => {
  const documentDefinition: TDocumentDefinitions = {
    content: [
      { text: 'RENTAL RECEIPT', style: 'header' },
      { text: '\n' },
      {
        text: `Date: ${formatDate(new Date().toISOString())}`,
        alignment: 'right'
      },
      { text: '\n' },
      { text: 'RECEIVED FROM', style: 'subheader' },
      {
        ul: [
          `Tenant Name: ${tenant.name}`,
          `Property: ${tenant.properties?.name || 'Not specified'}`,
          `Unit Number: ${tenant.unit_number}`,
        ]
      },
      { text: '\n' },
      { text: 'PAYMENT DETAILS', style: 'subheader' },
      {
        ul: [
          `Amount: $${tenant.rent_amount}`,
          `Payment Period: ${formatDate(new Date().toISOString())}`,
          'Payment Method: ______________',
        ]
      },
      { text: '\n\n' },
      {
        columns: [
          {
            width: '*',
            text: '_______________________\nLandlord Signature'
          },
          {
            width: '*',
            text: '_______________________\nDate'
          }
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      }
    }
  };

  return new Promise<Blob>((resolve, reject) => {
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.getBlob((blob: Blob) => {
      resolve(blob);
    }, (error: any) => {
      reject(error);
    });
  });
};