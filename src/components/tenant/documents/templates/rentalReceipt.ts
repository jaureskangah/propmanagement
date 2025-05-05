
import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/build/pdfmake";
import type { Tenant } from "@/types/tenant";
import { formatDate } from "./utils";

// Import fonts directly from the vfs_fonts file
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { getDefaultStyles } from "./utils/pdfStyles";

// Initialize pdfMake with the fonts
(pdfMake as any).vfs = (pdfFonts as any).vfs;

// Helper function to get property name safely
const getPropertyName = (tenant: Tenant): string => {
  if (!tenant.properties) {
    return 'Not specified';
  }
  
  if (typeof tenant.properties === 'object' && !Array.isArray(tenant.properties) && tenant.properties !== null) {
    if ('name' in tenant.properties && typeof tenant.properties.name === 'string') {
      return tenant.properties.name;
    }
  }
  
  if (Array.isArray(tenant.properties) && tenant.properties.length > 0) {
    const firstProperty = tenant.properties[0];
    if (typeof firstProperty === 'object' && firstProperty !== null && 'name' in firstProperty) {
      return firstProperty.name;
    }
  }
  
  return 'Not specified';
};

export const generateRentalReceipt = async (tenant: Tenant) => {
  const documentDefinition: TDocumentDefinitions = {
    content: [
      { text: 'RENTAL RECEIPT', style: 'header' },
      { text: '\n' },
      {
        text: `Date: ${formatDate(new Date())}`,
        alignment: 'right'
      },
      { text: '\n' },
      { text: 'RECEIVED FROM', style: 'subheader' },
      {
        ul: [
          `Tenant Name: ${tenant.name}`,
          `Property: ${getPropertyName(tenant)}`,
          `Unit Number: ${tenant.unit_number}`,
        ]
      },
      { text: '\n' },
      { text: 'PAYMENT DETAILS', style: 'subheader' },
      {
        ul: [
          `Amount: $${tenant.rent_amount}`,
          `Payment Period: ${formatDate(new Date())}`,
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
    styles: getDefaultStyles()
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
