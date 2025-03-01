
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MaintenanceRequest } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenancePhotoGallery } from "./MaintenancePhotoGallery";
import { Calendar, Clock, MessageCircle, AlertOctagon, Star } from "lucide-react";
import { Rating } from "@/components/ui/rating";

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
  canRate,
}: MaintenanceDetailSheetProps) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500 text-white";
      case "High":
        return "bg-orange-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "Low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-500 text-white";
      case "In Progress":
        return "bg-blue-500 text-white";
      case "Pending":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() && rating === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Mettre à jour la demande avec les commentaires et évaluation de l'utilisateur
      const { error } = await supabase
        .from('maintenance_requests')
        .update({
          tenant_feedback: feedback,
          tenant_rating: rating,
        })
        .eq('id', request.id);
      
      if (error) throw error;
      
      toast({
        title: t('success'),
        description: t('feedbackSaved'),
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: t('error'),
        description: t('errorSavingFeedback'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculer le temps écoulé depuis la création de la demande
  const daysSinceCreation = Math.floor(
    (new Date().getTime() - new Date(request.created_at).getTime()) / (1000 * 3600 * 24)
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{request.issue}</SheetTitle>
          <SheetDescription className="flex flex-wrap gap-2 mt-2">
            <Badge className={getPriorityClass(request.priority)}>
              <AlertOctagon className="h-3 w-3 mr-1" />
              {request.priority} {t('priority')}
            </Badge>
            <Badge className={getStatusClass(request.status)}>
              {request.status}
            </Badge>
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Informations clés */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {t('createdOn')} {formatDate(request.created_at)}
              {daysSinceCreation > 0 && ` (${daysSinceCreation} ${t('daysAgo')})`}
            </div>
            
            {request.deadline && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                {t('deadline')}: {formatDate(request.deadline)}
              </div>
            )}
          </div>
          
          {/* Description */}
          {request.description && (
            <div className="border rounded-md p-4 bg-muted/50">
              <h4 className="font-medium mb-2">{t('description')}</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {request.description}
              </p>
            </div>
          )}
          
          {/* Photos */}
          {request.photos && request.photos.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">{t('photos')}</h4>
              <MaintenancePhotoGallery photos={request.photos} />
            </div>
          )}
          
          {/* Historique de statut (simulé pour démonstration) */}
          <div>
            <h4 className="font-medium mb-3">{t('statusHistory')}</h4>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{request.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(request.updated_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('statusPending')}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(request.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Évaluation pour les demandes résolues */}
          {canRate && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                {t('provideFeedback')}
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">{t('rating')}</label>
                  <Rating 
                    value={rating} 
                    onChange={setRating} 
                    max={5} 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">{t('comments')}</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t('feedbackPlaceholder')}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <SheetFooter className="flex flex-col sm:flex-row-reverse gap-2 pt-2 border-t">
          {canRate && (
            <Button 
              onClick={handleSubmitFeedback} 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {t('close')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
