import type { Tenant } from "@/types/tenant";

export const generateTemplateContent = (template: string, tenant: Tenant): string => {
  switch (template) {
    case "lease":
      return `LEASE AGREEMENT

Tenant: ${tenant.name}
Email: ${tenant.email}
Phone: ${tenant.phone || 'Not provided'}
Property: ${tenant.properties?.name || 'Not specified'}
Unit Number: ${tenant.unit_number}
Start Date: ${tenant.lease_start}
End Date: ${tenant.lease_end}
Monthly Rent: $${tenant.rent_amount}

[The rest of the contract can be edited here]`;

    case "receipt":
      return `RENT RECEIPT

Tenant: ${tenant.name}
Property: ${tenant.properties?.name || 'Not specified'}
Unit Number: ${tenant.unit_number}
Amount: $${tenant.rent_amount}
Date: ${new Date().toLocaleDateString()}

[Payment details can be edited here]`;

    case "notice":
      return `NOTICE TO VACATE

Date: ${new Date().toLocaleDateString()}

To: ${tenant.name}
${tenant.properties?.name || 'Property Address'}
Unit ${tenant.unit_number}

Dear ${tenant.name},

This letter serves as formal notice that you are required to vacate the premises described above. 

Current Lease Details:
- Lease Start Date: ${tenant.lease_start}
- Lease End Date: ${tenant.lease_end}
- Monthly Rent: $${tenant.rent_amount}

Please ensure that:
1. All personal belongings are removed
2. The unit is cleaned thoroughly
3. All keys are returned
4. A forwarding address is provided

[Additional terms and conditions can be edited here]

Sincerely,
Property Management`;

    default:
      throw new Error("Template not implemented");
  }
};