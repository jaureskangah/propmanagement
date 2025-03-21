
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { MaintenanceRequest } from "@/types/tenant";
import { MaintenanceInfo } from "./MaintenanceInfo";
import { FeedbackSection } from "./FeedbackSection";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteMaintenanceDialog } from "../../DeleteMaintenanceDialog";

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
  canRate,
}: MaintenanceDetailSheetContentProps) => {
  const { t } = useLocale();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  return (
    <SheetContent className="sm:max-w-md p-0">
      <SheetHeader className="p-6 pb-2">
        <div className="flex justify-between items-center">
          <SheetTitle>{request.issue}</SheetTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDeleteDialogOpen(true)} 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </SheetHeader>

      <div className="px-6 py-4 max-h-[calc(100vh-10rem)] overflow-y-auto space-y-6">
        <MaintenanceInfo request={request} />
        
        {canRate && (
          <FeedbackSection 
            requestId={request.id} 
            existingFeedback={request.tenant_feedback} 
            existingRating={request.tenant_rating}
            onFeedbackSubmitted={onUpdate}
          />
        )}
      </div>
      
      <SheetFooter className="px-6 py-4 border-t">
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="w-full"
        >
          {t('close')}
        </Button>
      </SheetFooter>

      <DeleteMaintenanceDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        request={request}
        onSuccess={onUpdate}
      />
    </SheetContent>
  );
};
