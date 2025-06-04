
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Invitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  tenant_id: string;
  tenants: {
    name: string;
    properties: {
      name: string;
    };
  };
}

const InvitationsDashboard = () => {
  const { toast } = useToast();
  const [resendingId, setResendingId] = useState<string | null>(null);

  const { data: invitations, isLoading, refetch } = useQuery({
    queryKey: ['tenant-invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_invitations')
        .select(`
          *,
          tenants (
            name,
            properties (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Invitation[];
    }
  });

  const getStatusIcon = (status: string, expiresAt: string) => {
    if (status === 'accepted') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === 'expired' || new Date(expiresAt) < new Date()) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    if (status === 'accepted') {
      return <Badge variant="default" className="bg-green-100 text-green-800">Acceptée</Badge>;
    }
    if (status === 'expired' || new Date(expiresAt) < new Date()) {
      return <Badge variant="destructive">Expirée</Badge>;
    }
    return <Badge variant="secondary">En attente</Badge>;
  };

  const handleResendInvitation = async (invitationId: string, email: string, tenantId: string) => {
    setResendingId(invitationId);
    
    try {
      // Generate new token and expiration
      const newToken = crypto.randomUUID();
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 7);

      // Update invitation with new token
      const { error: updateError } = await supabase
        .from('tenant_invitations')
        .update({
          token: newToken,
          expires_at: newExpiresAt.toISOString(),
          status: 'pending'
        })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      // Send new email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-tenant-email', {
        body: {
          to: [email],
          subject: "Nouvelle invitation - Portail Locataire",
          content: `
            <h2>Rejoignez votre portail locataire</h2>
            <p>Vous avez été invité(e) à rejoindre le portail locataire.</p>
            <p>Cliquez sur le lien ci-dessous pour créer votre compte :</p>
            <p><a href="${window.location.origin}/invite/${newToken}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Créer mon compte</a></p>
            <p>Ce lien expire dans 7 jours.</p>
          `
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Invitation renvoyée",
        description: "Une nouvelle invitation a été envoyée par email.",
      });

      refetch();
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'invitation.",
        variant: "destructive",
      });
    } finally {
      setResendingId(null);
    }
  };

  const calculateDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invitations envoyées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Chargement...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invitations envoyées</CardTitle>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </CardHeader>
      <CardContent>
        {!invitations || invitations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune invitation envoyée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => {
              const isExpired = new Date(invitation.expires_at) < new Date();
              const daysRemaining = calculateDaysRemaining(invitation.expires_at);
              
              return (
                <div key={invitation.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(invitation.status, invitation.expires_at)}
                        <h3 className="font-medium">{invitation.tenants.name}</h3>
                        {getStatusBadge(invitation.status, invitation.expires_at)}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Email :</strong> {invitation.email}</p>
                        <p><strong>Propriété :</strong> {invitation.tenants.properties?.name}</p>
                        <p><strong>Envoyée le :</strong> {format(new Date(invitation.created_at), 'PPP', { locale: fr })}</p>
                        <p><strong>Expire le :</strong> {format(new Date(invitation.expires_at), 'PPP', { locale: fr })}</p>
                        
                        {invitation.status === 'pending' && !isExpired && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>{daysRemaining > 0 ? `${daysRemaining} jour(s) restant(s)` : 'Expire aujourd\'hui'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {(invitation.status === 'pending' && isExpired) || invitation.status === 'expired' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResendInvitation(invitation.id, invitation.email, invitation.tenant_id)}
                          disabled={resendingId === invitation.id}
                        >
                          {resendingId === invitation.id ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3 mr-1" />
                              Renvoyer
                            </>
                          )}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationsDashboard;
