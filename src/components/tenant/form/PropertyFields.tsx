
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { TenantFormValues } from "../tenantValidation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProperties } from "@/hooks/useProperties";

interface PropertyFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

export const PropertyFields = ({ form }: PropertyFieldsProps) => {
  const { t } = useLocale();
  const { properties, isLoading } = useProperties();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="property_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.propertyLabel')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('form.propertyPlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="" disabled>
                    {t('loading')}
                  </SelectItem>
                ) : properties && properties.length > 0 ? (
                  properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} - {property.address}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    {t('noProperties')}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="unit_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.unitFormLabel')}</FormLabel>
            <FormControl>
              <Input placeholder={t('form.unitPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
