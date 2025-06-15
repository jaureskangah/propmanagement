import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import AppSidebar from "@/components/AppSidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mail, RefreshCw, X, CheckCircle2, Clock, AlertCircle, Sync } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const Invitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [sendingInvitations, setSendingInvitations] = useState<Set<string>>(new Set());
  const [syncingStatus, setSyncingStatus] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { t } = useLocale();
  const { toast } = useToast();

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenant_invitations')
        .select(`
          *,
          tenants:tenant_id (
            name,
            tenant_profile_id,
            properties (name)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = data.map(invitation => ({
        ...invitation,
        tenant_name: invitation.tenants?.name || 'Unknown',
        property_name: invitation.tenants?.properties?.name || 'Unknown'
      }));
      
      setInvitations(transformedData);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast({
        title: t('error'),
        description: t('errorFetchingData'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour synchroniser automatiquement le statut des invitations
  const syncInvitationStatus = async (invitation: Invitation) => {
    setSyncingStatus(prev => new Set(prev).add(invitation.id));
    
    try {
      console.log("Syncing invitation status for:", invitation.email);
      
      // Vérifier si le locataire a un profil lié
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('tenant_profile_id')
        .eq('id', invitation.tenant_id)
        .single();

      if (tenantError) {
        console.error("Error checking tenant profile:", tenantError);
        return;
      }

      // Si le locataire a un profil lié, l'invitation devrait être acceptée
      if (tenantData.tenant_profile_id && invitation.status === 'pending') {
        console.log("Found linked profile, updating invitation status to accepted");
        
        const { error: updateError } = await supabase
          .from('tenant_invitations')
          .update({ 
            status: 'accepted',
            updated_at: new Date().toISOString()
          })
          .eq('id', invitation.id);

        if (updateError) {
          console.error("Error updating invitation status:", updateError);
          toast({
            title: "Erreur de synchronisation",
            description: "Impossible de mettre à jour le statut de l'invitation.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Statut synchronisé",
            description: "Le statut de l'invitation a été mis à jour.",
          });
          fetchInvitations(); // Rafraîchir la liste
        }
      }
    } catch (error) {
      console.error("Error syncing invitation status:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la synchronisation du statut.",
        variant: "destructive",
      });
    } finally {
      setSyncingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitation.id);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchInvitations();
      
      // Set up real-time subscription to get updates
      const channel = supabase
        .channel('tenant_invitations_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tenant_invitations',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Invitation change detected:', payload);
            fetchInvitations(); // Refresh data when changes occur
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleResendInvitation = async (invitation: Invitation) => {
    setSendingInvitations(prev => new Set(prev).add(invitation.id));
    
    try {
      console.log("Resending invitation for:", invitation.email, "to tenant ID:", invitation.tenant_id);
      
      const newToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase
        .from('tenant_invitations')
        .update({
          token: newToken,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        })
        .eq('id', invitation.id);

      if (error) throw error;
      
      console.log("Invitation updated successfully, now sending email");
      
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('name, email')
        .eq('id', invitation.tenant_id)
        .single();

      if (tenantError) {
        console.error("Error fetching tenant data:", tenantError);
        throw new Error("Impossible de récupérer les données du locataire");
      }
      
      toast({
        title: "Envoi en cours",
        description: `Envoi de l'invitation à ${invitation.email}...`,
      });
      
      try {
        console.log("Calling send-tenant-email edge function");
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-tenant-email', {
          body: {
            tenantId: invitation.tenant_id,
            subject: "Nouvelle invitation à rejoindre l'espace locataire",
            content: `
              <p>Bonjour ${tenantData.name},</p>
              <p>Vous avez reçu une nouvelle invitation à rejoindre l'espace locataire de votre propriété.</p>
              <p>Pour créer votre compte et accéder à vos informations, veuillez cliquer sur le lien ci-dessous :</p>
              <p><a href="${window.location.origin}/tenant-signup?invitation=${newToken}">Créer mon compte</a></p>
              <p>Une fois votre compte créé, vous pourrez accéder à toutes les fonctionnalités de l'espace locataire.</p>
              <p>Cordialement,<br>Votre équipe de gestion immobilière</p>
            `,
            category: 'invitation'
          }
        });

        console.log("Email function response:", emailData);

        if (emailError) {
          console.error("Error sending invitation email:", emailError);
          
          toast({
            title: "Erreur d'envoi",
            description: "L'invitation a été mise à jour mais l'email n'a pas pu être envoyé automatiquement",
            variant: "destructive",
          });
          return;
        }
        
        console.log("Email sent successfully");
        
        toast({
          title: "Invitation envoyée avec succès",
          description: `L'invitation a été envoyée à ${invitation.email}`,
        });
      } catch (emailError: any) {
        console.error("Error in resend email process:", emailError);
        
        toast({
          title: "Erreur d'envoi",
          description: "L'invitation a été mise à jour mais l'email n'a pas pu être envoyé",
          variant: "destructive",
        });
        return;
      }

      fetchInvitations();
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'invitation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSendingInvitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitation.id);
        return newSet;
      });
    }
  };

  const handleCancelInvitation = async (invitation: Invitation) => {
    try {
      const { error } = await supabase
        .from('tenant_invitations')
        .update({
          status: 'cancelled'
        })
        .eq('id', invitation.id);

      if (error) throw error;

      toast({
        title: "Invitation annulée",
        description: "L'invitation a été annulée avec succès",
      });

      fetchInvitations();
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler l'invitation. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const isExpired = (invitation: Invitation) => {
    return new Date(invitation.expires_at) < new Date();
  };

  const filteredInvitations = () => {
    switch (activeTab) {
      case 'pending':
        return invitations.filter(inv => inv.status === 'pending' && !isExpired(inv));
      case 'expired':
        return invitations.filter(inv => isExpired(inv) && inv.status === 'pending');
      case 'cancelled':
        return invitations.filter(inv => inv.status === 'cancelled');
      case 'completed':
        return invitations.filter(inv => inv.status === 'accepted');
      default:
        return invitations;
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
    <div className="min-h-screen bg-background">
      <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className={cn(
        "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Invitations</h1>
              <p className="text-muted-foreground">Gérez les invitations envoyées aux locataires</p>
            </div>
            <Button onClick={fetchInvitations} variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Actualiser</span>
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="expired">Expirées</TabsTrigger>
              <TabsTrigger value="completed">Acceptées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredInvitations().length === 0 ? (
                <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center h-64">
                  <Mail className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Aucune invitation</h3>
                  <p className="text-muted-foreground text-center mt-1">
                    Aucune invitation {activeTab !== 'all' ? `dans cette catégorie` : ''} pour le moment
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredInvitations().map((invitation) => (
                    <Card key={invitation.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{invitation.tenant_name}</CardTitle>
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
                          <div className="flex justify-between w-full gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleCancelInvitation(invitation)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Annuler
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-orange-600 border-orange-200 hover:bg-orange-50"
                              onClick={() => syncInvitationStatus(invitation)}
                              disabled={syncingStatus.has(invitation.id)}
                            >
                              {syncingStatus.has(invitation.id) ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-1"></div>
                                  Sync...
                                </>
                              ) : (
                                <>
                                  <Sync className="h-4 w-4 mr-1" />
                                  Sync
                                </>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={() => handleResendInvitation(invitation)}
                              disabled={sendingInvitations.has(invitation.id)}
                            >
                              {sendingInvitations.has(invitation.id) ? (
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
                            onClick={() => handleResendInvitation(invitation)}
                            disabled={sendingInvitations.has(invitation.id)}
                          >
                            {sendingInvitations.has(invitation.id) ? (
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
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Invitations;
