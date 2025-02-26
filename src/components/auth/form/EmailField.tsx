
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormValues } from "../signUpValidation";
import { useLocale } from "@/components/providers/LocaleProvider";

interface EmailFieldProps {
  form: UseFormReturn<SignUpFormValues>;
  disabled?: boolean;
}

export function EmailField({ form, disabled }: EmailFieldProps) {
  const { t } = useLocale();

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('email')}</FormLabel>
          <FormControl>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="email" 
                placeholder={t('enterEmail')} 
                className="pl-8" 
                disabled={disabled}
                {...field} 
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
