
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Mail } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormValues } from "../signUpValidation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ModernInput } from "@/components/ui/modern-input";

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
          <FormControl>
            <ModernInput
              type="email"
              placeholder={t('enterEmail')}
              icon={<Mail className="h-4 w-4" />}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-red-400 text-xs" />
        </FormItem>
      )}
    />
  );
}
