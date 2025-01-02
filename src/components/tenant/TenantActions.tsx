import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TenantActionsProps {
  onAddClick: () => void;
}

export const TenantActions = ({ onAddClick }: TenantActionsProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Tenants Management</h1>
      <Button 
        className="flex items-center gap-2 transition-transform hover:scale-105 animate-fade-in"
        onClick={onAddClick}
      >
        <Plus className="h-4 w-4" />
        Add Tenant
      </Button>
    </div>
  );
};