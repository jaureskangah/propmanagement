
import { Sheet } from "@/components/ui/sheet";
import { MaintenanceRequest } from "@/types/tenant";
import { MaintenanceDetailSheetContent } from "./detail-sheet/MaintenanceDetailSheetContent";

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
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <MaintenanceDetailSheetContent 
        request={request} 
        onClose={onClose} 
        onUpdate={onUpdate} 
        canRate={canRate} 
      />
    </Sheet>
  );
};
