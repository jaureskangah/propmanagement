
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, UserCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormValues } from "../signUpValidation";
import { useLocale } from "@/components/providers/LocaleProvider";

interface NameFieldsProps {
  form: UseFormReturn<SignUpFormValues>;
  disabled?: boolean;
}

export function NameFields({ form, disabled }: NameFieldsProps) {
  const { t } = useLocale();

  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('firstName')}</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder={t('enterFirstName')} className="pl-8" disabled={disabled} {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('lastName')}</FormLabel>
            <FormControl>
              <div className="relative">
                <UserCheck className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder={t('enterLastName')} className="pl-8" disabled={disabled} {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
