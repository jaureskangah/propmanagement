
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { TenantFormValues } from "../tenantValidation";
import { useTenantFormTranslations } from "@/hooks/useTenantFormTranslations";
import { useProperties } from "@/hooks/useProperties";

interface PropertyFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

export const PropertyFields = ({ form }: PropertyFieldsProps) => {
  const { t } = useTenantFormTranslations();
  const { properties, isLoading } = useProperties();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="property_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('formPropertyLabel')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('formPropertyPlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="" disabled>
                    Chargement...
                  </SelectItem>
                ) : properties && properties.length > 0 ? (
                  properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} - {property.address}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Aucune propriété disponible
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
            <FormLabel>{t('formUnitFormLabel')}</FormLabel>
            <FormControl>
              <Input placeholder={t('formUnitPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
