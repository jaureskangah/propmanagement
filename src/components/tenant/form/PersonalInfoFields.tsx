
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { TenantFormValues } from "../tenantValidation";
import { useTenantFormTranslations } from "@/hooks/useTenantFormTranslations";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

export const PersonalInfoFields = ({ form }: PersonalInfoFieldsProps) => {
  const { t } = useTenantFormTranslations();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('formNameLabel')}</FormLabel>
            <FormControl>
              <Input placeholder={t('formNamePlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('formEmailFormLabel')}</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder={t('formEmailPlaceholder')} 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('formPhoneFormLabel')}</FormLabel>
            <FormControl>
              <Input placeholder={t('formPhonePlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
