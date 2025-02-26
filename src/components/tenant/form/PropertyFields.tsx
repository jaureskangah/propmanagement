
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useProperties } from "@/hooks/useProperties";
import type { TenantFormValues } from "../tenantValidation";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

export function PropertyFields({ form }: PropertyFieldsProps) {
  const { properties } = useProperties();
  const { t } = useLocale();
  
  console.log("Properties data:", properties);

  const validProperties = properties?.filter(property => 
    property.id && 
    property.name && 
    typeof property.id === 'string' && 
    property.id.trim() !== ''
  ) || [];

  console.log("Valid properties:", validProperties);

  return (
    <>
      <FormField
        control={form.control}
        name="property_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('selectProperty')} *</FormLabel>
            <Select 
              onValueChange={(value) => {
                console.log("Selected value:", value);
                field.onChange(value);
              }}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectProperty')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {validProperties.map((property) => (
                  <SelectItem 
                    key={property.id} 
                    value={property.id}
                  >
                    {property.name}
                  </SelectItem>
                ))}
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
            <FormLabel>{t('unitNumber')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterUnitNumber')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
