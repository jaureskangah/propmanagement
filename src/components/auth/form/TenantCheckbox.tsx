import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormValues } from "../signUpValidation";

interface TenantCheckboxProps {
  form: UseFormReturn<SignUpFormValues>;
}

export function TenantCheckbox({ form }: TenantCheckboxProps) {
  return (
    <FormField
      control={form.control}
      name="isTenant"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              I am a tenant
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
}