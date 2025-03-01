
import { MessageSquare } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceRequest } from "@/types/tenant";
import { FeedbackForm } from "./feedback/FeedbackForm";
import { FeedbackConfirmDialog } from "./feedback/FeedbackConfirmDialog";
import { FeedbackDisplay } from "./feedback/FeedbackDisplay";
import { useFeedback } from "./feedback/useFeedback";

interface FeedbackSectionProps {
  request: MaintenanceRequest;
  onUpdate: () => void;
}

export const FeedbackSection = ({ request, onUpdate }: FeedbackSectionProps) => {
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
  } = useFeedback(request, onUpdate);

  if (!feedbackSubmitted) {
    return (
      <>
        <FeedbackForm
          rating={rating}
          feedback={feedback}
          validationError={validationError}
          isSubmitting={isSubmitting}
          onRatingChange={handleRatingChange}
          onFeedbackChange={handleFeedbackChange}
          onSubmit={openConfirmDialog}
        />

        <FeedbackConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          rating={rating}
          feedback={feedback}
          onConfirm={handleSubmitFeedback}
        />
      </>
    );
  }

  return (
    <div className="border-t pt-4 mt-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
        <MessageSquare className="h-4 w-4" /> {t('provideFeedback')}
      </h3>
      
      <FeedbackDisplay
        rating={rating}
        feedback={feedback}
        onEdit={() => setFeedbackSubmitted(false)}
      />
    </div>
  );
};
