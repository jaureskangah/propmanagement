
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorderTrail } from "@/components/ui/border-trail";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, RefreshCw, X, CheckCircle2, Clock, AlertCircle } from "lucide-react";

type Invitation = {
  id: string;
  email: string;
  tenant_id: string;
  status: string;
  created_at: string;
  expires_at: string;
  tenant_name?: string;
  property_name?: string;
}

interface InvitationCardProps {
  invitation: Invitation;
  onResend: (invitation: Invitation) => void;
  onCancel: (invitation: Invitation) => void;
  isResending: boolean;
}

export const InvitationCard = ({ 
  invitation, 
  onResend, 
  onCancel, 
  isResending 
}: InvitationCardProps) => {
  const isExpired = (invitation: Invitation) => {
    return new Date(invitation.expires_at) < new Date();
  };

  // Get gradient based on invitation status
  const getBackgroundGradient = (invitation: Invitation) => {
    if (isExpired(invitation) && invitation.status === 'pending') {
      return "from-red-500/10 to-red-600/10";
    }
    
    switch (invitation.status) {
      case 'pending':
        return "from-blue-500/10 to-blue-600/10";
      case 'accepted':
        return "from-green-500/10 to-green-600/10";
      case 'cancelled':
        return "from-red-500/10 to-red-600/10";
      default:
        return "from-gray-500/10 to-gray-600/10";
    }
  };

  // Get border color based on invitation status
  const getBorderColor = (invitation: Invitation) => {
    if (isExpired(invitation) && invitation.status === 'pending') {
      return "border-red-200 dark:border-red-800";
    }
    
    switch (invitation.status) {
      case 'pending':
        return "border-blue-200 dark:border-blue-800";
      case 'accepted':
        return "border-green-200 dark:border-green-800";
      case 'cancelled':
        return "border-red-200 dark:border-red-800";
      default:
        return "border-gray-200 dark:border-gray-800";
    }
  };

  const getStatusBadge = (invitation: Invitation) => {
    if (isExpired(invitation) && invitation.status === 'pending') {
      return <Badge variant="outline" className="bg-gray-100 text-gray-700">Expirée</Badge>;
    }
    
    switch (invitation.status) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-700">Acceptée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-700">Annulée</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (invitation: Invitation) => {
    if (isExpired(invitation) && invitation.status === 'pending') {
      return <AlertCircle className="h-10 w-10 text-gray-400" />;
    }
    
    switch (invitation.status) {
      case 'pending':
        return <Clock className="h-10 w-10 text-blue-400" />;
      case 'accepted':
        return <CheckCircle2 className="h-10 w-10 text-green-400" />;
      case 'cancelled':
        return <X className="h-10 w-10 text-red-400" />;
      default:
        return <Mail className="h-10 w-10 text-gray-400" />;
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm bg-gradient-to-br ${getBackgroundGradient(invitation)} border ${getBorderColor(invitation)}`}
    >
      <BorderTrail
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500"
        size={60}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          boxShadow: "0px 0px 30px 15px rgb(59 130 246 / 20%)"
        }}
      />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{invitation.tenant_name}</CardTitle>
            <CardDescription className="mt-1">{invitation.email}</CardDescription>
          </div>
          {getStatusIcon(invitation)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Propriété:</span>
            <span className="text-sm font-medium">{invitation.property_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date d'envoi:</span>
            <span className="text-sm">
              {new Date(invitation.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Expiration:</span>
            <span className="text-sm">
              {new Date(invitation.expires_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Statut:</span>
            {getStatusBadge(invitation)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {invitation.status === 'pending' && !isExpired(invitation) && (
          <div className="flex justify-between w-full">
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onCancel(invitation)}
            >
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => onResend(invitation)}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                  Envoi...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Renvoyer
                </>
              )}
            </Button>
          </div>
        )}
        {(invitation.status === 'cancelled' || isExpired(invitation)) && (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => onResend(invitation)}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                Envoi...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Renvoyer
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
