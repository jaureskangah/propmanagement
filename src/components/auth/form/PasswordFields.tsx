
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormValues } from "../signUpValidation";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PasswordFieldsProps {
  form: UseFormReturn<SignUpFormValues>;
  disabled?: boolean;
}

export function PasswordFields({ form, disabled }: PasswordFieldsProps) {
  const { t } = useLocale();

  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('password')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="password" 
                  placeholder={t('enterPassword')} 
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
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('confirmPassword')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="password" 
                  placeholder={t('confirmYourPassword')} 
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
    </>
  );
}
