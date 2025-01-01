import { Button } from "@/components/ui/button";
import { FileImage, CheckSquare } from "lucide-react";

export const WorkOrderActions = () => {
  return (
    <div className="flex gap-2 mt-4">
      <Button variant="outline" size="sm">
        <FileImage className="h-4 w-4 mr-2" />
        Photos
      </Button>
      <Button variant="outline" size="sm">
        <CheckSquare className="h-4 w-4 mr-2" />
        Mettre à jour
      </Button>
    </div>
  );
};