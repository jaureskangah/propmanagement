import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useProperties } from "@/hooks/useProperties";
import type { TenantFormValues } from "../tenantValidation";

interface PropertyFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

export function PropertyFields({ form }: PropertyFieldsProps) {
  const { properties } = useProperties();

  // Filter out any invalid properties and ensure IDs are valid strings
  const validProperties = properties?.filter(property => 
    property && 
    typeof property.id === 'string' && 
    property.id.trim() !== '' && 
    property.name
  ) || [];

  // Get current property_id value
  const currentPropertyId = form.watch("property_id");
  
  console.log("Valid properties:", validProperties);
  console.log("Current property ID:", currentPropertyId);

  return (
    <>
      <FormField
        control={form.control}
        name="property_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
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
            <FormLabel>Unit Number</FormLabel>
            <FormControl>
              <Input placeholder="A1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}