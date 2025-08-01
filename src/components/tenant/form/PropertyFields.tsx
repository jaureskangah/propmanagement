
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

  const handlePropertyChange = (propertyId: string) => {
    // Update property_id
    form.setValue("property_id", propertyId);
    
    // Auto-fill rent based on selected property
    const selectedProperty = properties?.find(p => p.id === propertyId);
    if (selectedProperty && selectedProperty.rent_amount) {
      form.setValue("rent_amount", selectedProperty.rent_amount);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="property_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('formPropertyLabel')}</FormLabel>
            <Select onValueChange={handlePropertyChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('formPropertyPlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    {t('loading')}
                  </SelectItem>
                ) : properties && properties.length > 0 ? (
                  properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} - {property.address} (${property.rent_amount}/{t('month')})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-properties" disabled>
                    {t('noPropertiesAvailable')}
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
