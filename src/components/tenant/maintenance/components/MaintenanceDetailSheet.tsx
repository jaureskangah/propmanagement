
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaintenanceRequest } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { MaintenancePhotoGallery } from "./MaintenancePhotoGallery";
import { Clock, CheckCircle2, AlertCircle, Calendar, MessageSquare } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  request: MaintenanceRequest;
  onUpdate: () => void;
  canRate: boolean;
}

export const MaintenanceDetailSheet = ({
  isOpen,
  onClose,
  request,
  onUpdate,
  canRate
}: MaintenanceDetailSheetProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(request.tenant_rating || 0);
  const [feedback, setFeedback] = useState<string>(request.tenant_feedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Reset state when the request changes or sheet opens
  useEffect(() => {
    if (isOpen) {
      setRating(request.tenant_rating || 0);
      setFeedback(request.tenant_feedback || "");
      setFeedbackSubmitted(!!request.tenant_feedback || !!request.tenant_rating);
    }
  }, [isOpen, request]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Resolved": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "In Progress": return <Clock className="h-5 w-5 text-blue-500" />;
      case "Pending": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case "Urgent": return "bg-red-500 hover:bg-red-600";
      case "High": return "bg-orange-500 hover:bg-orange-600";
      case "Medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "Low": return "bg-green-500 hover:bg-green-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case "Resolved": return "bg-green-500 hover:bg-green-600";
      case "In Progress": return "bg-blue-500 hover:bg-blue-600";
      case "Pending": return "bg-yellow-500 hover:bg-yellow-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
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
          tenant_rating: rating
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
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{request.issue}</SheetTitle>
          <SheetDescription>
            {t('createdOn')} {formatDate(request.created_at)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-3">
            <Badge className={`${getStatusClass(request.status)} text-white`}>
              <span className="flex items-center gap-1">
                {getStatusIcon(request.status)} {request.status}
              </span>
            </Badge>
            <Badge className={`${getPriorityClass(request.priority)} text-white`}>
              {request.priority}
            </Badge>
          </div>

          {/* Description */}
          {request.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                {request.description}
              </p>
            </div>
          )}

          {/* Deadline if available */}
          {request.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{t('deadline')}:</span> {formatDate(request.deadline)}
              </span>
            </div>
          )}

          {/* Photos Gallery */}
          {request.photos && request.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('maintenancePhotos')}</h3>
              <MaintenancePhotoGallery photos={request.photos} />
            </div>
          )}

          {/* Feedback Section for Resolved Requests */}
          {canRate && (
            <div className="border-t pt-4 mt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> {t('provideFeedback')}
              </h3>
              
              {!feedbackSubmitted ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t('rating')}</p>
                    <Rating 
                      value={rating} 
                      onChange={setRating} 
                      max={5} 
                      className="mb-3"
                    />
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
                    onClick={handleSubmitFeedback} 
                    disabled={isSubmitting}
                    className="mt-2 w-full"
                  >
                    {isSubmitting ? t('submitting') : t('submit')}
                  </Button>
                </div>
              ) : (
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
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
