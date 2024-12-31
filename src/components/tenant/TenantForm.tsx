import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TenantFormValues, tenantFormSchema } from "./tenantValidation";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { PropertyFields } from "./form/PropertyFields";
import { LeaseFields } from "./form/LeaseFields";

interface TenantFormProps {
  onSubmit: (data: TenantFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  defaultValues?: Partial<TenantFormValues>;
}

export function TenantForm({ onSubmit, isSubmitting, onCancel, defaultValues }: TenantFormProps) {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      property_id: "",
      unit_number: "",
      lease_start: "",
      lease_end: "",
      rent_amount: 0,
    },
  });

  const isEditMode = !!defaultValues;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PersonalInfoFields form={form} />
        <PropertyFields form={form} />
        <LeaseFields form={form} />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Update Tenant" : "Add Tenant"}
          </Button>
        </div>
      </form>
    </Form>
  );
}