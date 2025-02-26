
import { z } from "zod";

export const tenantFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  property_id: z.string().min(1, "Property is required"),
  unit_number: z.string().optional(),
  lease_start: z.string().min(1, "Lease start date is required"),
  lease_end: z.string().min(1, "Lease end date is required"),
  rent_amount: z.number().min(0, "Rent amount must be positive"),
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;
