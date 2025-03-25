
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WorkOrderHeaderProps {
  onCreateWorkOrder: () => void;
}

export const WorkOrderHeader = ({ onCreateWorkOrder }: WorkOrderHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Ordres de Travail</h2>
      <Button onClick={onCreateWorkOrder} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Créer un Ordre
      </Button>
    </div>
  );
};
