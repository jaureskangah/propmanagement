
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WorkOrderFormProvider } from "./form/WorkOrderFormContext";
import { StepIndicator } from "./form/StepIndicator";
import { StepContent } from "./form/steps/StepContent";
import { WorkOrderFormActions } from "./form/WorkOrderFormActions";
import { useWorkOrderSubmit } from "./form/useWorkOrderSubmit";
import { useWorkOrderForm } from "./form/WorkOrderFormContext";

interface CreateWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyId?: string;
}

export const CreateWorkOrderDialog = ({
  isOpen,
  onClose,
  onSuccess,
  propertyId: initialPropertyId,
}: CreateWorkOrderDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <WorkOrderFormProvider initialPropertyId={initialPropertyId || null}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Créer un nouveau bon de travail</DialogTitle>
            <DialogDescription>
              Remplissez les informations nécessaires pour créer un nouveau bon de travail
            </DialogDescription>
          </DialogHeader>
          
          <StepIndicator />
          
          <FormWithSubmit onSuccess={onSuccess} onClose={onClose} />
        </WorkOrderFormProvider>
      </DialogContent>
    </Dialog>
  );
};

// We need this component to use the form context hooks
const FormWithSubmit = ({ onSuccess, onClose }: { onSuccess: () => void, onClose: () => void }) => {
  const { resetForm } = useWorkOrderForm();
  const { submitWorkOrder } = useWorkOrderSubmit({ 
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    submitWorkOrder(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <StepContent />
      <WorkOrderFormActions onSubmit={handleSubmit} />
    </form>
  );
};
