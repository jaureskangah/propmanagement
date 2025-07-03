
import { z } from "zod";

export const createTenantFormSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t('tenantNameRequired')),
    email: z.string().email(t('invalidEmail')).min(1, t('tenantEmailRequired')),
    phone: z.string().optional(),
    property_id: z.string().min(1, t('propertyError')),
    unit_number: z.string().min(1, t('required')),
    lease_start: z.string().min(1, t('required')),
    lease_end: z.string().min(1, t('required')),
    rent_amount: z.number().min(0, t('invalidAmount')),
  });
};

export type TenantFormValues = z.infer<ReturnType<typeof createTenantFormSchema>>;
