
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Save } from "lucide-react";
import { useWorkOrderForm } from "./WorkOrderFormContext";

interface WorkOrderFormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const WorkOrderFormActions = ({ onSubmit }: WorkOrderFormActionsProps) => {
  const { currentStep, navigateToStep, isSubmitting } = useWorkOrderForm();
  const totalSteps = 3;

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToStep(currentStep - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToStep(currentStep + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(e as unknown as React.FormEvent);
  };

  return (
    <div className="flex justify-between gap-2 pt-4" onClick={(e) => e.stopPropagation()}>
      {currentStep > 1 && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handlePrevious}
        >
          Précédent
        </Button>
      )}
      <div className="flex-1" />
      {currentStep < totalSteps ? (
        <Button
          type="button"
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Suivant <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Création..." : "Enregistrer"}
        </Button>
      )}
    </div>
  );
};
