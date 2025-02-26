
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { TenantFormValues } from "../tenantValidation";
import { useLocale } from "@/components/providers/LocaleProvider";

interface LeaseFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

export const LeaseFields = ({ form }: LeaseFieldsProps) => {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="lease_start"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('leaseStart')}</FormLabel>
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
            <FormLabel>{t('leaseEnd')}</FormLabel>
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
            <FormLabel>{t('rentAmount')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
