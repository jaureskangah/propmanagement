import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const tenantSignupSchema = z.object({
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(6, 'La confirmation est requise'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type TenantSignupValues = z.infer<typeof tenantSignupSchema>;

const TenantSignup = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [tenantData, setTenantData] = useState<any>(null);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [linkingStatus, setLinkingStatus] = useState<'idle' | 'linking' | 'verifying' | 'success' | 'failed'>('idle');

  const form = useForm<TenantSignupValues>({
    resolver: zodResolver(tenantSignupSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Récupérer les données du locataire à partir du token d'invitation
  useEffect(() => {
    const token = searchParams.get('invitation');
    if (token) {
      setInvitationToken(token);
      fetchTenantDataFromInvitation(token);
    }
  }, [searchParams]);

  const fetchTenantDataFromInvitation = async (token: string) => {
    try {
      console.log("Fetching tenant data for invitation token:", token);
      
      // Rechercher l'invitation avec ce token
      const { data: invitation, error: invitationError } = await supabase
        .from('tenant_invitations')
        .select(`
          *,
          tenants:tenant_id (
            id,
            name,
            email,
            phone,
            properties:property_id (name)
          )
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (invitationError || !invitation) {
        console.error("Invalid invitation:", invitationError);
        toast({
          title: "Invitation invalide",
          description: "Ce lien d'invitation n'est pas valide ou a expiré.",
          variant: "destructive",
        });
        return;
      }

      console.log("Invitation found:", invitation);
      setTenantData(invitation.tenants);
    } catch (error) {
      console.error("Error fetching tenant data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations du locataire.",
        variant: "destructive",
      });
    }
  };

  const linkTenantProfile = async (userId: string, tenantId: string): Promise<boolean> => {
    console.log("=== STARTING TENANT PROFILE LINKING ===");
    console.log("User ID:", userId);
    console.log("Tenant ID:", tenantId);
    
    try {
      // Étape 1: Attendre que les triggers Supabase s'exécutent (création du profil)
      console.log("Step 1: Waiting for profile creation triggers...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Étape 2: Nettoyer toute liaison existante pour ce locataire
      console.log("Step 2: Clearing any existing tenant profile links...");
      const { error: clearError } = await supabase
        .from('tenants')
        .update({ tenant_profile_id: null })
        .eq('id', tenantId);

      if (clearError) {
        console.warn("Warning clearing existing link:", clearError);
        // Continuer même si cette étape échoue
      }

      // Attendre que la mise à jour se propage
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Étape 3: Créer la nouvelle liaison
      console.log("Step 3: Creating new tenant profile link...");
      const { data: updateResult, error: linkError } = await supabase
        .from('tenants')
        .update({ 
          tenant_profile_id: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenantId)
        .select('id, tenant_profile_id');

      if (linkError) {
        console.error("Error linking tenant profile:", linkError);
        return false;
      }

      console.log("Update result:", updateResult);

      // Étape 4: Vérifier que la liaison a bien été effectuée
      console.log("Step 4: Verifying the link was successful...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data: verification, error: verifyError } = await supabase
        .from('tenants')
        .select('id, tenant_profile_id, email, name')
        .eq('id', tenantId)
        .single();

      if (verifyError) {
        console.error("Verification failed:", verifyError);
        return false;
      }

      console.log("Verification result:", verification);
      
      if (verification?.tenant_profile_id !== userId) {
        console.error("Link verification failed - IDs don't match");
        console.error("Expected:", userId, "Got:", verification?.tenant_profile_id);
        return false;
      }

      console.log("=== TENANT PROFILE LINKING SUCCESSFUL ===");
      return true;
    } catch (error) {
      console.error("Exception during linking:", error);
      return false;
    }
  };

  const onSubmit = async (values: TenantSignupValues) => {
    if (!tenantData || !invitationToken) {
      toast({
        title: "Erreur",
        description: "Données d'invitation manquantes.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setLinkingStatus('idle');

    try {
      console.log("=== STARTING TENANT SIGNUP PROCESS ===");
      console.log("Creating account for tenant:", tenantData.id, "with email:", tenantData.email);
      
      // Créer le compte utilisateur avec les métadonnées incluant le tenant_id
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: tenantData.email,
        password: values.password,
        options: {
          data: {
            first_name: tenantData.name.split(' ')[0] || '',
            last_name: tenantData.name.split(' ').slice(1).join(' ') || '',
            is_tenant_user: true,
            tenant_id: tenantData.id,
          },
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('Aucune donnée utilisateur retournée');
      }

      console.log("User created successfully with ID:", signUpData.user.id);

      // Lier le profil du locataire
      setLinkingStatus('linking');
      console.log("Starting tenant linking process...");
      setLinkingStatus('verifying');
      
      const linkingSuccess = await linkTenantProfile(signUpData.user.id, tenantData.id);
      
      if (!linkingSuccess) {
        console.error("Failed to link tenant profile");
        setLinkingStatus('failed');
        toast({
          title: "Erreur de liaison",
          description: "Le compte a été créé mais la liaison au profil locataire a échoué. Contactez le support.",
          variant: "destructive",
        });
        return;
      }

      setLinkingStatus('success');
      console.log("Tenant linking successful!");

      // Mettre à jour l'invitation comme acceptée
      const { error: updateError } = await supabase
        .from('tenant_invitations')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString() 
        })
        .eq('token', invitationToken);

      if (updateError) {
        console.error("Error updating invitation status:", updateError);
        // Non bloquant, on continue
      } else {
        console.log("Invitation marked as accepted");
      }

      console.log("=== SIGNUP PROCESS COMPLETED SUCCESSFULLY ===");

      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé et lié à votre profil locataire. Redirection en cours...",
      });

      // Redirection après un délai pour permettre à l'utilisateur de voir le message
      setTimeout(() => {
        window.location.href = '/tenant/dashboard';
      }, 2000);

    } catch (error: any) {
      console.error("=== SIGNUP PROCESS FAILED ===", error);
      setLinkingStatus('failed');
      
      let errorMessage = "Une erreur s'est produite lors de la création du compte.";
      
      if (error.message.includes('already registered')) {
        errorMessage = "Un compte existe déjà avec cette adresse email.";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Rediriger si déjà authentifié
  if (isAuthenticated) {
    return <Navigate to="/tenant/dashboard" replace />;
  }

  // Afficher un message d'erreur si pas de token d'invitation
  if (!invitationToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">
              Lien invalide
            </CardTitle>
            <CardDescription>
              Ce lien d'invitation n'est pas valide ou a expiré.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getLinkingStatusDisplay = () => {
    switch (linkingStatus) {
      case 'linking':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Liaison du profil en cours...</span>
          </div>
        );
      case 'verifying':
        return (
          <div className="flex items-center space-x-2 text-orange-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Vérification de la liaison...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Profil lié avec succès!</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Échec de la liaison du profil</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Créer votre compte locataire
          </CardTitle>
          <CardDescription>
            {tenantData ? (
              <>
                Bonjour <strong>{tenantData.name}</strong>,<br />
                Créez votre mot de passe pour accéder à votre espace locataire.
              </>
            ) : (
              "Chargement de vos informations..."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tenantData ? (
            <>
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Informations pré-remplies</span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Nom :</strong> {tenantData.name}</p>
                  <p><strong>Email :</strong> {tenantData.email}</p>
                  {tenantData.properties && (
                    <p><strong>Propriété :</strong> {tenantData.properties.name}</p>
                  )}
                </div>
              </div>

              {linkingStatus !== 'idle' && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  {getLinkingStatusDisplay()}
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || linkingStatus === 'success'}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {linkingStatus === 'linking' ? 'Liaison en cours...' : 
                         linkingStatus === 'verifying' ? 'Vérification...' : 
                         'Création du compte...'}
                      </>
                    ) : linkingStatus === 'success' ? (
                      'Redirection...'
                    ) : (
                      'Créer mon compte'
                    )}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantSignup;
