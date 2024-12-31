import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { TenantFormValues } from "../tenantValidation";

interface LeaseFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

export function LeaseFields({ form }: LeaseFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="lease_start"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lease Start Date *</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lease_end"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lease End Date *</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="rent_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Rent *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="1000"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}