
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useLocale } from "@/components/providers/LocaleProvider";

interface CommentFieldProps {
  form: UseFormReturn<any>;
}

export const CommentField = ({ form }: CommentFieldProps) => {
  const { t } = useLocale();

  return (
    <FormField
      control={form.control}
      name="comment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('detailedComment')}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={t('shareExperience')}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
