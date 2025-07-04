
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { MaintenanceRequest } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { X, Clock, Calendar, AlertTriangle, MessageSquare, CheckCircle, ChevronRight } from "lucide-react";
import { FeedbackSection } from "./feedback/FeedbackSection";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MaintenanceDetailSheetContentProps {
  request: MaintenanceRequest;
  onClose: () => void;
  onUpdate: () => void;
  canRate: boolean;
}

export const MaintenanceDetailSheetContent = ({
  request,
  onClose,
  onUpdate,
  canRate
}: MaintenanceDetailSheetContentProps) => {
  const { t, language } = useLocale();
  const [activeTab, setActiveTab] = useState("details");

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Resolved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {status}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  return (
    <SheetContent className="sm:max-w-md overflow-y-auto">
      <SheetHeader className="pb-4 border-b">
        <div className="flex justify-between items-center">
          <SheetTitle className="text-xl">{request.issue}</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </SheetHeader>

      <div className="flex items-center gap-3 my-4">
        {getStatusBadge(request.status)}
        
        {request.priority === "Urgent" && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {t('urgent')}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="details">{t('details')}</TabsTrigger>
          <TabsTrigger value="feedback" disabled={!canRate}>
            {t('feedback')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{t('created')}: {formatDate(request.created_at, language)}</span>
            </div>
            
            {request.updated_at && request.updated_at !== request.created_at && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t('updated')}: {formatDate(request.updated_at, language)}</span>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t('description')}
              </h3>
              <p className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                {request.description || t('noDescriptionProvided')}
              </p>
            </div>

            {request.photos && request.photos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {t('photos')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {request.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="rounded-md w-full h-auto object-cover aspect-square"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="feedback">
          <FeedbackSection
            requestId={request.id}
            existingFeedback={request.tenant_feedback}
            existingRating={request.tenant_rating}
            onUpdate={onUpdate}
          />
        </TabsContent>
      </Tabs>

      <SheetFooter className="mt-6 flex justify-end border-t pt-4">
        <Button variant="outline" onClick={onClose}>
          {t('close')}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};
