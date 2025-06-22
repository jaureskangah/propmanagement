
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceRequest } from "@/components/maintenance/types";
import { MaintenanceDetailsTab } from "./tabs/MaintenanceDetailsTab";
import { MaintenancePhotosTab } from "./tabs/MaintenancePhotosTab";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceRequestDialogProps {
  request: MaintenanceRequest | null;
  onClose: () => void;
  onUpdate: () => void;
  open: boolean;
}

export const MaintenanceRequestDialog = ({
  request,
  onClose,
  onUpdate,
  open,
}: MaintenanceRequestDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const { t } = useLocale();

  // Reset active tab when a new request is selected
  useEffect(() => {
    if (request && open) {
      setActiveTab("details");
      console.log(`Dialog opened for request: ${request.id}`, { open });
    }
  }, [request, open]);

  const handleMaintenanceUpdate = () => {
    console.log("Updating maintenance data from dialog");
    onUpdate();
  };

  if (!request) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{request.issue}</DialogTitle>
          <DialogDescription>
            Détails de la demande de maintenance
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details">{t('details')}</TabsTrigger>
            <TabsTrigger value="photos">{t('photos')}</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <MaintenanceDetailsTab 
              request={request} 
              onUpdate={handleMaintenanceUpdate} 
            />
          </TabsContent>

          <TabsContent value="photos">
            <MaintenancePhotosTab photos={request.photos || []} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
