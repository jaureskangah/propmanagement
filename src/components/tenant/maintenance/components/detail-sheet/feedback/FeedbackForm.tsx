
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FeedbackFormProps {
  rating: number;
  feedback: string;
  validationError: string | null;
  isSubmitting: boolean;
  onRatingChange: (value: number) => void;
  onFeedbackChange: (value: string) => void;
  onSubmit: () => void;
}

export const FeedbackForm = ({
  rating,
  feedback,
  validationError,
  isSubmitting,
  onRatingChange,
  onFeedbackChange,
  onSubmit
}: FeedbackFormProps) => {
  const { t } = useLocale();

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-500 mb-1">{t('rating')}</p>
        <Rating 
          value={rating} 
          onChange={onRatingChange}
          max={5} 
          className="mb-3"
        />
        
        {validationError && (
          <Alert variant="destructive" className="mt-2 py-2">
            <AlertDescription className="text-sm">{validationError}</AlertDescription>
          </Alert>
        )}
      </div>
      
      <div>
        <p className="text-sm text-gray-500 mb-1">{t('comments')}</p>
        <Textarea
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder={t('feedbackPlaceholder')}
          className="resize-none h-24"
        />
      </div>
      
      <Button 
        onClick={onSubmit} 
        disabled={isSubmitting}
        className="mt-2 w-full"
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </div>
  );
};
