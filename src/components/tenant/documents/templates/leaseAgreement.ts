import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { Tenant } from "@/types/tenant";
import { formatDate } from "@/lib/utils";

// Initialize pdfMake with the fonts
pdfMake.vfs = (pdfFonts as any).vfs;

export const generateLeaseAgreement = async (tenant: Tenant) => {
  const documentDefinition = {
    content: [
      { text: 'RESIDENTIAL LEASE AGREEMENT', style: 'header' },
      { text: '\n' },
      {
        text: [
          { text: 'THIS LEASE AGREEMENT', bold: true },
          ` is made on ${formatDate(new Date().toISOString())} between the Landlord and Tenant:`,
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
          `Property: ${tenant.properties?.name || 'Not specified'}`,
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

  return pdfMake.createPdf(documentDefinition);
};