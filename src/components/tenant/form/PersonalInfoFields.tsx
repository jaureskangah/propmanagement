
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { TenantFormValues } from "../tenantValidation";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  const { t } = useLocale();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('name')} *</FormLabel>
            <FormControl>
              <Input placeholder={t('enterName')} {...field} />
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
            <FormLabel>{t('email')} *</FormLabel>
            <FormControl>
              <Input type="email" placeholder={t('enterEmail')} {...field} />
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
            <FormLabel>{t('phone')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterPhone')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
