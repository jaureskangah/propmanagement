
import * as z from "zod";

export const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  status: z.string().min(1, "Status is required"),
  payment_date: z.date({
    required_error: "Date is required",
  }),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
