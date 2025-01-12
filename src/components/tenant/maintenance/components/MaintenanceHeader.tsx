import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface MaintenanceHeaderProps {
  onAddClick: () => void;
}

export const MaintenanceHeader = ({ onAddClick }: MaintenanceHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">Maintenance Requests</CardTitle>
      <Button 
        onClick={onAddClick}
        className="bg-[#ea384c] hover:bg-[#ea384c]/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Request
      </Button>
    </CardHeader>
  );
};