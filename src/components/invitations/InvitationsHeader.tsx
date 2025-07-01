
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail } from "lucide-react";

interface InvitationsHeaderProps {
  invitationsCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export const InvitationsHeader = ({ 
  invitationsCount, 
  onRefresh, 
  isLoading 
}: InvitationsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Invitations</h1>
            <p className="text-muted-foreground">
              Gérez les invitations de vos locataires ({invitationsCount} invitations)
            </p>
          </div>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Actualiser
      </Button>
    </div>
  );
};
