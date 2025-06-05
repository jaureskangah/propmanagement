
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Send, Clock, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Invitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
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
  const queryClient = useQueryClient();
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

  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('tenant_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Invitation annulée",
        description: "L'invitation a été annulée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['tenant-invitations'] });
    },
    onError: (error: any) => {
      console.error('Error cancelling invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler l'invitation.",
        variant: "destructive",
      });
    }
  });

  const getStatusIcon = (status: string, expiresAt: string) => {
    if (status === 'accepted') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === 'cancelled') {
      return <X className="h-4 w-4 text-gray-500" />;
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
    if (status === 'cancelled') {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Annulée</Badge>;
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
      const invitationUrl = `${window.location.origin}/invite/${newToken}`;
      
      const { error: emailError } = await supabase.functions.invoke('send-tenant-email', {
        body: {
          tenantId: tenantId,
          subject: "Nouvelle invitation - Portail Locataire",
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb; text-align: center;">Rappel - Votre portail locataire vous attend</h1>
              
              <p>Bonjour,</p>
              
              <p>Nous vous avons récemment envoyé une invitation pour rejoindre votre portail locataire. Cette invitation avait expiré, nous vous en envoyons donc une nouvelle.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" 
                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Créer mon compte maintenant
                </a>
              </div>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⚠️ Attention :</strong> Cette nouvelle invitation expire dans 7 jours.
                </p>
              </div>
              
              <p style="color: #666;">
                Si vous rencontrez des difficultés pour créer votre compte, contactez directement votre propriétaire.
              </p>
              
              <hr style="border: 1px solid #e2e8f0; margin: 30px 0;" />
              
              <p style="color: #888; font-size: 12px; text-align: center;">
                Ce message a été envoyé via notre système de gestion immobilière.
              </p>
            </div>
          `,
          category: 'invitation'
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        toast({
          title: "Invitation mise à jour",
          description: "L'invitation a été mise à jour mais l'email n'a pas pu être envoyé.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Invitation renvoyée",
          description: "Une nouvelle invitation a été envoyée par email.",
        });
      }

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
              const isPending = invitation.status === 'pending' && !isExpired;
              const canResend = invitation.status === 'expired' || isExpired || invitation.status === 'cancelled';
              const canCancel = invitation.status === 'pending' && !isExpired;
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
                        
                        {isPending && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>{daysRemaining > 0 ? `${daysRemaining} jour(s) restant(s)` : 'Expire aujourd\'hui'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {canCancel && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Annuler
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Annuler l'invitation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir annuler cette invitation ? Le locataire ne pourra plus utiliser le lien d'invitation.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => cancelInvitationMutation.mutate(invitation.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Confirmer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      {canResend && (
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
                      )}
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
