
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { User, UserCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormValues } from "../signUpValidation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ModernInput } from "@/components/ui/modern-input";

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
            <FormControl>
              <ModernInput
                placeholder={t('enterFirstName')}
                icon={<User className="h-4 w-4" />}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ModernInput
                placeholder={t('enterLastName')}
                icon={<UserCheck className="h-4 w-4" />}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
}
