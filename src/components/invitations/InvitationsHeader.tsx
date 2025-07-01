
import React from "react";
import { Mail, Info, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface InvitationsHeaderProps {
  invitationsCount: number;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const InvitationsHeader = ({ 
  invitationsCount, 
  onRefresh,
  isLoading = false 
}: InvitationsHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('invitations')}
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez les invitations envoyées aux locataires
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            <Info className="h-4 w-4 mr-1.5" />
            {invitationsCount} {invitationsCount === 1 ? 'invitation' : 'invitations'}
          </Badge>
          
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            size="sm" 
            className="gap-1"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
