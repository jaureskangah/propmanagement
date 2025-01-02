import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export const EmptyTenantState = () => {
  return (
    <Card className="p-8 text-center space-y-4 animate-fade-in">
      <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
        <UserPlus className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No tenants yet</h3>
      <p className="text-muted-foreground">
        Start managing your rentals by adding your first tenant. 
        Click the "Add Tenant" button above to get started.
      </p>
    </Card>
  );
};