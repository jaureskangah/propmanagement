
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useFeedback = (
  requestId: string, 
  existingFeedback: string | null, 
  existingRating: number | null, 
  onUpdate: () => void
) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(existingRating || 0);
  const [feedback, setFeedback] = useState<string>(existingFeedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!existingFeedback || !!existingRating);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validateForm = (): boolean => {
    if (rating === 0) {
      setValidationError(t('ratingRequired'));
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  const openConfirmDialog = () => {
    if (!validateForm()) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
    if (validationError) validateForm();
  };

  const handleFeedbackChange = (value: string) => {
    setFeedback(value);
  };

  const handleSubmitFeedback = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Submitting feedback:", { id: requestId, feedback, rating });
      
      const { error } = await supabase
        .from('maintenance_requests')
        .update({
          tenant_feedback: feedback,
          tenant_rating: rating,
          updated_at: new Date().toISOString() // Force an update event for notifications
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      toast({
        title: t('success'),
        description: t('feedbackSaved'),
      });
      
      setFeedbackSubmitted(true);
      onUpdate();
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast({
        title: t('error'),
        description: t('errorSavingFeedback'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  return {
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
  };
};
