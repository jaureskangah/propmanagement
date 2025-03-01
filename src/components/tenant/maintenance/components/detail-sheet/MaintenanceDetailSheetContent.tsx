
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MaintenanceRequest } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
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
        {canRate && <FeedbackSection request={request} onUpdate={onUpdate} />}
      </div>
    </SheetContent>
  );
};
