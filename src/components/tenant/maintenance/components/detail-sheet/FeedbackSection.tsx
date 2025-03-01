
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { useLocale } from "@/components/providers/LocaleProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceRequest } from "@/types/tenant";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface FeedbackSectionProps {
  request: MaintenanceRequest;
  onUpdate: () => void;
}

export const FeedbackSection = ({ request, onUpdate }: FeedbackSectionProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(request.tenant_rating || 0);
  const [feedback, setFeedback] = useState<string>(request.tenant_feedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!request.tenant_feedback || !!request.tenant_rating);
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

  const handleSubmitFeedback = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Submitting feedback:", { id: request.id, feedback, rating });
      
      const { error } = await supabase
        .from('maintenance_requests')
        .update({
          tenant_feedback: feedback,
          tenant_rating: rating,
          updated_at: new Date().toISOString() // Force an update event for notifications
        })
        .eq('id', request.id);

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

  if (!feedbackSubmitted) {
    return (
      <>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">{t('rating')}</p>
            <Rating 
              value={rating} 
              onChange={(value) => {
                setRating(value);
                if (validationError) validateForm();
              }} 
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
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t('feedbackPlaceholder')}
              className="resize-none h-24"
            />
          </div>
          
          <Button 
            onClick={openConfirmDialog} 
            disabled={isSubmitting}
            className="mt-2 w-full"
          >
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </div>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
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
              <AlertDialogAction onClick={handleSubmitFeedback}>
                {t('confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
      <div>
        <p className="text-sm text-gray-500 mb-1">{t('rating')}</p>
        <Rating 
          value={rating} 
          onChange={setRating} 
          max={5}
          className="mb-3" 
        />
      </div>
      
      {feedback && (
        <div>
          <p className="text-sm text-gray-500 mb-1">{t('comments')}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-white dark:bg-gray-700 p-3 rounded-md">
            {feedback}
          </p>
        </div>
      )}
      
      <Button 
        onClick={() => setFeedbackSubmitted(false)} 
        variant="outline"
        className="mt-2"
      >
        {t('edit')}
      </Button>
    </div>
  );
};
