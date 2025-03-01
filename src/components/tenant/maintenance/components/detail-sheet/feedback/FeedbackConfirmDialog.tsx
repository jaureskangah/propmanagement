
import { useLocale } from "@/components/providers/LocaleProvider";
import { Rating } from "@/components/ui/rating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FeedbackConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rating: number;
  feedback: string;
  onConfirm: () => void;
}

export const FeedbackConfirmDialog = ({
  open,
  onOpenChange,
  rating,
  feedback,
  onConfirm
}: FeedbackConfirmDialogProps) => {
  const { t } = useLocale();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmSubmit')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('areYouSure')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-3">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-500">{t('rating')}</p>
            <Rating value={rating} onChange={() => {}} max={5} className="mt-1" />
          </div>
          
          {feedback && (
            <div>
              <p className="text-sm font-medium text-gray-500">{t('comments')}</p>
              <p className="text-sm mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">{feedback}</p>
            </div>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
