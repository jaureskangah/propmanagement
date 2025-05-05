
import { z } from "zod";

// Nous utilisons une fonction pour créer le schéma avec les messages traduits
export const createTenantFormSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t('form.required')),
  email: z.string().email(t('invalidEmail')),
  phone: z.string().optional(),
  property_id: z.string().min(1, t('form.required')),
  unit_number: z.string().optional(),
  lease_start: z.string().min(1, t('form.required')),
  lease_end: z.string().min(1, t('form.required')),
  rent_amount: z.number().min(0, t('invalidAmount')),
});

// Pour la compatibilité TypeScript, nous exportons un type basé sur le schéma
export type TenantFormValues = z.infer<ReturnType<typeof createTenantFormSchema>>;

// Pour la rétrocompatibilité, nous exportons aussi une version par défaut du schéma
export const tenantFormSchema = createTenantFormSchema((key) => key);
