
import { useState, useEffect } from "react";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MaintenanceRequest } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MessageSquare } from "lucide-react";
import { MaintenanceInfo } from "./MaintenanceInfo";
import { FeedbackSection } from "./FeedbackSection";

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
  const { t } = useLocale();

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>{request.issue}</SheetTitle>
        <SheetDescription>
          {t('createdOn')} {formatDate(request.created_at)}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        {/* Request Information */}
        <MaintenanceInfo request={request} />

        {/* Feedback Section for Resolved Requests */}
        {canRate && (
          <div className="border-t pt-4 mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> {t('provideFeedback')}
            </h3>
            
            <FeedbackSection request={request} onUpdate={onUpdate} />
          </div>
        )}
      </div>
    </SheetContent>
  );
};
