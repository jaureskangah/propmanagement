
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

export const generateLeaseAgreement = async (tenant: Tenant) => {
  const documentDefinition: TDocumentDefinitions = {
    content: [
      { text: 'RESIDENTIAL LEASE AGREEMENT', style: 'header' },
      { text: '\n' },
      {
        text: [
          { text: 'THIS LEASE AGREEMENT', bold: true },
          ` is made on ${formatDate(new Date())} between the Landlord and Tenant:`,
        ]
      },
      { text: '\n' },
      { text: 'TENANT INFORMATION', style: 'subheader' },
      {
        ul: [
          `Name: ${tenant.name}`,
          `Email: ${tenant.email}`,
          `Phone: ${tenant.phone || 'Not provided'}`,
        ]
      },
      { text: '\n' },
      { text: 'PROPERTY INFORMATION', style: 'subheader' },
      {
        ul: [
          `Property: ${getPropertyName(tenant)}`,
          `Unit Number: ${tenant.unit_number}`,
        ]
      },
      { text: '\n' },
      { text: 'LEASE TERMS', style: 'subheader' },
      {
        ul: [
          `Lease Start Date: ${formatDate(tenant.lease_start)}`,
          `Lease End Date: ${formatDate(tenant.lease_end)}`,
          `Monthly Rent: $${tenant.rent_amount}`,
        ]
      },
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
