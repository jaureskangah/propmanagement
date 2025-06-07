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

  const verifyTenantLinking = async (userId: string, tenantId: string, retryCount = 0): Promise<boolean> => {
    console.log(`Verifying tenant linking (attempt ${retryCount + 1}):`, { userId, tenantId });
    
    try {
      const { data: linkedTenant, error } = await supabase
        .from('tenants')
        .select('tenant_profile_id')
        .eq('id', tenantId)
        .eq('tenant_profile_id', userId)
        .single();

      if (error) {
        console.error("Error verifying linking:", error);
        return false;
      }

      const isLinked = linkedTenant && linkedTenant.tenant_profile_id === userId;
      console.log("Linking verification result:", isLinked);
      return isLinked;
    } catch (error) {
      console.error("Exception during verification:", error);
      return false;
    }
  };

  const retryTenantLinking = async (userId: string, tenantId: string, maxRetries = 3): Promise<boolean> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      console.log(`Linking attempt ${attempt + 1}/${maxRetries}`);
      
      try {
        const { error: linkError } = await supabase
          .from('tenants')
          .update({ 
            tenant_profile_id: userId,
            updated_at: new Date().toISOString()
          })
          .eq('id', tenantId);

        if (linkError) {
          console.error(`Linking attempt ${attempt + 1} failed:`, linkError);
          if (attempt === maxRetries - 1) return false;
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }

        // Wait a bit for the update to propagate
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify the linking was successful
        const isLinked = await verifyTenantLinking(userId, tenantId, attempt);
        if (isLinked) {
          console.log(`Linking successful on attempt ${attempt + 1}`);
          return true;
        }

        console.log(`Linking verification failed on attempt ${attempt + 1}`);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      } catch (error) {
        console.error(`Exception during linking attempt ${attempt + 1}:`, error);
        if (attempt === maxRetries - 1) return false;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    return false;
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
      console.log("Creating account for tenant:", tenantData.id);
      
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

      // Étape 1: Attendre que le profil soit créé par le trigger
      setLinkingStatus('linking');
      console.log("Waiting for profile creation...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Étape 2: Lier le profil du locataire avec retry
      console.log("Starting tenant linking process...");
      setLinkingStatus('verifying');
      
      const linkingSuccess = await retryTenantLinking(signUpData.user.id, tenantData.id);
      
      if (!linkingSuccess) {
        console.error("Failed to link tenant after multiple retries");
        throw new Error('Impossible de lier le profil locataire après plusieurs tentatives');
      }

      console.log("Tenant linking successful!");
      setLinkingStatus('success');

      // Mettre à jour l'invitation comme acceptée
      const { error: updateError } = await supabase
        .from('tenant_invitations')
        .update({ status: 'accepted' })
        .eq('token', invitationToken);

      if (updateError) {
        console.error("Error updating invitation status:", updateError);
        // Non bloquant, on continue
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
      } else if (error.message.includes('lier le profil')) {
        errorMessage = "Le compte a été créé mais n'a pas pu être lié au profil locataire. Contactez le support.";
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

              {/* Status de liaison */}
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
