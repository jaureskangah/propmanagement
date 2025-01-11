import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CommunicationsHeaderProps {
  onNewClick: () => void;
  onInviteTenantClick: () => void;
}

export const CommunicationsHeader = ({ 
  onNewClick,
  onInviteTenantClick 
}: CommunicationsHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Communications History</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={onInviteTenantClick}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Invite Tenant
          </Button>
          <Button 
            onClick={onNewClick}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Email
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};