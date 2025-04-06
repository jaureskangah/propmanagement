
import type { Tenant } from "@/types/tenant";

export const generateTemplateContent = (template: string, tenant?: Tenant): string => {
  switch (template) {
    case "lease":
      return `LEASE AGREEMENT

Tenant: {{name}}
Email: {{email}}
Phone: {{phone}}
Property: {{properties.name}}
Unit Number: {{unit_number}}
Start Date: {{lease_start}}
End Date: {{lease_end}}
Monthly Rent: \${{rent_amount}}

This LEASE AGREEMENT is made on {{currentDate}} between the Landlord and Tenant.

1. PREMISES
   The Landlord agrees to rent to the Tenant the dwelling located at {{properties.name}}, Unit {{unit_number}}.

2. TERM
   The term of this lease begins on {{lease_start}} and ends on {{lease_end}}.

3. RENT
   The monthly rent for the premises is \${{rent_amount}} due on the first day of each month.

4. SECURITY DEPOSIT
   The Tenant will pay a security deposit of $________ upon signing this agreement.

5. UTILITIES
   The Tenant is responsible for paying all utilities, except:
   _______________________________________

6. MAINTENANCE
   The Tenant agrees to keep the premises in a clean and sanitary condition and to immediately notify the Landlord of any defects or maintenance issues.

[Additional terms and conditions can be added here]

Landlord: _________________________     Date: _____________

Tenant: __________________________     Date: _____________`;

    case "receipt":
      return `RENT RECEIPT

Tenant: {{name}}
Property: {{properties.name}}
Unit Number: {{unit_number}}
Amount: \${{rent_amount}}
Date: {{currentDate}}

This document certifies that the landlord has received payment from {{name}} for the amount of \${{rent_amount}} representing the monthly rent for the property located at {{properties.name}}, Unit {{unit_number}}.

Payment method: ________________
Payment period: ________________

Landlord signature: _________________________

Thank you for your payment!`;

    case "notice":
      return `NOTICE TO VACATE

Date: {{currentDate}}

To: {{name}}
{{properties.name}}
Unit {{unit_number}}

Dear {{name}},

This letter serves as formal notice that you are required to vacate the premises described above. 

Current Lease Details:
- Lease Start Date: {{lease_start}}
- Lease End Date: {{lease_end}}
- Monthly Rent: \${{rent_amount}}

Please ensure that:
1. All personal belongings are removed
2. The unit is cleaned thoroughly
3. All keys are returned
4. A forwarding address is provided

Reason for notice: ________________________

Move-out date: ________________________

Sincerely,
Property Management`;

    default:
      throw new Error("Template not implemented");
  }
};
