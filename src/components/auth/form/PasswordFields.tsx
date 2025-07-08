
import { useState } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Lock, Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormValues } from "../signUpValidation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ModernInput } from "@/components/ui/modern-input";

interface PasswordFieldsProps {
  form: UseFormReturn<SignUpFormValues>;
  disabled?: boolean;
}

export function PasswordFields({ form, disabled }: PasswordFieldsProps) {
  const { t } = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ModernInput
                type={showPassword ? "text" : "password"}
                placeholder={t('enterPassword')}
                icon={<Lock className="h-4 w-4" />}
                rightIcon={showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                onRightIconClick={() => setShowPassword(!showPassword)}
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
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ModernInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t('confirmYourPassword')}
                icon={<Lock className="h-4 w-4" />}
                rightIcon={showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        )}
      />
    </>
  );
}
