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

  console.log("Properties available:", properties);
  console.log("Current form value for property_id:", form.watch("property_id"));

  const validProperties = properties?.filter(property => property && property.id) || [];

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
              defaultValue="select-property"
              value={field.value || "select-property"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="select-property" disabled>
                  Select a property
                </SelectItem>
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