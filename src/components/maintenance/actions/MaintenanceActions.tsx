
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceActionsProps {
  onCreateTask: () => void;
  onAddExpense: () => void;
}

export const MaintenanceActions = ({ 
  onCreateTask, 
  onAddExpense 
}: MaintenanceActionsProps) => {
  const { t } = useLocale();
  
  return (
    <div className="flex justify-between items-center">
      <Button 
        onClick={onCreateTask}
        className="bg-primary hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('addTask')}
      </Button>
      
      <Button 
        onClick={onAddExpense}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('addExpense') || "Ajouter une dépense"}
      </Button>
    </div>
  );
};
