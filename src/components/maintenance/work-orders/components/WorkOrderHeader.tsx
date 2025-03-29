
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface WorkOrderHeaderProps {
  onCreateWorkOrder: () => void;
}

export const WorkOrderHeader = ({ onCreateWorkOrder }: WorkOrderHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <Wrench className="h-4 w-4 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold">Ordres de Travail</h2>
      </div>
      <Button 
        onClick={onCreateWorkOrder} 
        className="bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Créer un Ordre
      </Button>
    </div>
  );
};
