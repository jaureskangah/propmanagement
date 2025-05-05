
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TenantFormValues, createTenantFormSchema } from "./tenantValidation";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { PropertyFields } from "./form/PropertyFields";
import { LeaseFields } from "./form/LeaseFields";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantFormProps {
  onSubmit: (data: TenantFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  defaultValues?: Partial<TenantFormValues>;
}

export function TenantForm({ onSubmit, isSubmitting, onCancel, defaultValues }: TenantFormProps) {
  const { t } = useLocale();
  
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(createTenantFormSchema(t)),
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
        <div>
          <h3 className="text-lg font-medium mb-4">{t('form.personalInfo')}</h3>
          <PersonalInfoFields form={form} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">{t('form.propertyInfo')}</h3>
          <PropertyFields form={form} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">{t('form.leaseInfo')}</h3>
          <LeaseFields form={form} />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('form.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              t('saving')
            ) : isEditMode ? (
              t('form.saveChanges')
            ) : (
              t('form.saveTenant')
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
