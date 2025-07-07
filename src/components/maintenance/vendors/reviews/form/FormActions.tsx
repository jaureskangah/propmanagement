
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const FormActions = ({ onCancel, isSubmitting, isEditing }: FormActionsProps) => {
  const { t } = useLocale();

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>
        {t('cancel')}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('saving') : isEditing ? t('updateReview') : t('submitReview')}
      </Button>
    </div>
  );
};
