
import { useFeedback } from "../../detail-sheet/feedback/useFeedback";
import { FeedbackForm } from "./FeedbackForm";
import { FeedbackDisplay } from "./FeedbackDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface FeedbackSectionProps {
  requestId: string;
  existingFeedback: string | null;
  existingRating: number | null;
  onUpdate: () => void;
}

export const FeedbackSection = ({
  requestId,
  existingFeedback,
  existingRating,
  onUpdate
}: FeedbackSectionProps) => {
  const { t } = useLocale();
  const {
    rating,
    feedback,
    isSubmitting,
    feedbackSubmitted,
    validationError,
    showConfirmDialog,
    setShowConfirmDialog,
    setFeedbackSubmitted,
    handleRatingChange,
    handleFeedbackChange,
    openConfirmDialog,
    handleSubmitFeedback
  } = useFeedback(requestId, existingFeedback, existingRating, onUpdate);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md text-sm text-blue-800 dark:text-blue-300 mb-4">
        {t('yourFeedbackHelpsImprove')}
      </div>
      
      {feedbackSubmitted ? (
        <FeedbackDisplay
          rating={rating}
          feedback={feedback}
          onEdit={() => setFeedbackSubmitted(false)}
        />
      ) : (
        <FeedbackForm
          rating={rating}
          feedback={feedback}
          validationError={validationError}
          isSubmitting={isSubmitting}
          onRatingChange={handleRatingChange}
          onFeedbackChange={handleFeedbackChange}
          onSubmit={openConfirmDialog}
        />
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('confirmFeedback')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('feedbackSubmitConfirmation')}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmitFeedback} disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('confirmSubmission')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
