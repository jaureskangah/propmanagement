
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Toggle } from "@/components/ui/toggle";
import { useLocale } from "@/components/providers/LocaleProvider";

interface BasicInfoFieldsProps {
  form: UseFormReturn<any>;
}

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  const { t } = useLocale();
  
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('name')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterVendorName')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('specialty')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterVendorSpecialty')} {...field} />
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
              <Input type="tel" placeholder={t('enterPhoneNumber')} {...field} />
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
            <FormLabel>{t('email')}</FormLabel>
            <FormControl>
              <Input type="email" placeholder={t('enterEmailAddress')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="emergency_contact"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <Toggle
                pressed={field.value}
                onPressedChange={field.onChange}
                className="data-[state=on]:bg-red-100 data-[state=on]:text-red-700 data-[state=on]:font-medium"
              >
                {t('emergencyContact')}
              </Toggle>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
