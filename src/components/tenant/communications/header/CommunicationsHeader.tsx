import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";

interface CommunicationsHeaderProps {
  onNewClick: () => void;
}

export const CommunicationsHeader = ({ onNewClick }: CommunicationsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CardTitle className="text-lg">Communications History</CardTitle>
      </div>
      <Button 
        onClick={onNewClick}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        New Communication
      </Button>
    </div>
  );
};