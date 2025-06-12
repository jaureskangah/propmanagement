
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

interface TenantData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  properties?: {
    name: string;
  };
}

const TenantSignup = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [linkingStatus, setLinkingStatus] = useState<'idle' | 'linking' | 'success' | 'failed'>('idle');

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
      setTenantData(invitation.tenants as TenantData);
    } catch (error) {
      console.error("Error fetching tenant data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations du locataire.",
        variant: "destructive",
      });
    }
  };

  const checkExistingUser = async (email: string): Promise<{ exists: boolean; userId?: string }> => {
    try {
      console.log("Checking if user already exists with email:", email);
      
      // Vérifier dans auth.users via l'API admin
      const { data: users, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error("Error checking existing users:", error);
        return { exists: false };
      }

      const existingUser = users.users.find(user => user.email === email);
      
      if (existingUser) {
        console.log("Found existing user:", existingUser.id);
        return { exists: true, userId: existingUser.id };
      }

      return { exists: false };
    } catch (error) {
      console.error("Error in checkExistingUser:", error);
      return { exists: false };
    }
  };

  const linkTenantProfile = async (userId: string, userEmail: string, tenantId: string): Promise<boolean> => {
    console.log("=== STARTING TENANT PROFILE LINKING ===");
    console.log("User ID:", userId);
    console.log("User Email:", userEmail);
    console.log("Tenant ID:", tenantId);
    
    try {
      // Vérifier que l'email correspond directement avec les paramètres passés
      const { data: tenantCheck, error: tenantCheckError } = await supabase
        .from('tenants')
        .select('id, name, email')
        .eq('id', tenantId)
        .single();
      
      console.log("Tenant check:", tenantCheck?.email);
      console.log("Tenant check error:", tenantCheckError);
      
      // Vérification de sécurité : l'email doit correspondre
      if (!tenantCheck || userEmail !== tenantCheck.email) {
        console.error("Email mismatch - security check failed");
        console.error("User email:", userEmail);
        console.error("Tenant email:", tenantCheck?.email);
        return false;
      }
      
      console.log("✅ Email verification passed");
      
      // Utiliser la fonction de base de données améliorée pour faire la liaison
      const { data: linkResult, error: linkError } = await supabase.rpc('link_tenant_profile', {
        p_tenant_id: tenantId,
        p_user_id: userId
      });

      console.log("Link result:", linkResult);
      console.log("Link error:", linkError);

      if (linkError) {
        console.error("Link error:", linkError);
        return false;
      }

      if (!linkResult) {
        console.error("Link failed - function returned false");
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
      
      // Vérifier d'abord si un utilisateur existe déjà avec cet email
      const existingUserCheck = await checkExistingUser(tenantData.email);
      
      let userId: string;
      let userEmail: string;

      if (existingUserCheck.exists && existingUserCheck.userId) {
        console.log("User already exists, using existing user for linking");
        userId = existingUserCheck.userId;
        userEmail = tenantData.email;
        
        toast({
          title: "Compte existant détecté",
          description: "Liaison avec le compte existant en cours...",
        });
      } else {
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
          
          // Gérer le cas où l'utilisateur existe déjà
          if (signUpError.message.includes('already registered')) {
            console.log("User already registered, attempting to link existing user");
            const existingUser = await checkExistingUser(tenantData.email);
            if (existingUser.exists && existingUser.userId) {
              userId = existingUser.userId;
              userEmail = tenantData.email;
            } else {
              throw new Error("Impossible de récupérer l'utilisateur existant");
            }
          } else {
            throw signUpError;
          }
        } else {
          if (!signUpData.user) {
            throw new Error('Aucune donnée utilisateur retournée');
          }
          
          console.log("User created successfully with ID:", signUpData.user.id);
          userId = signUpData.user.id;
          userEmail = signUpData.user.email || tenantData.email;
        }
      }

      // Maintenant, lier le profil utilisateur au tenant
      setLinkingStatus('linking');
      console.log("Starting tenant linking process...");

      // Attendre un peu pour que l'utilisateur soit bien créé/récupéré
      await new Promise(resolve => setTimeout(resolve, 1000));

      const linkSuccess = await linkTenantProfile(userId, userEmail, tenantData.id);

      if (!linkSuccess) {
        console.error("Failed to link tenant profile");
        throw new Error("Impossible de lier le profil au locataire");
      }

      // Marquer l'invitation comme acceptée
      const { error: updateError } = await supabase
        .from('tenant_invitations')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('token', invitationToken);

      if (updateError) {
        console.error("Error updating invitation status:", updateError);
      }

      setLinkingStatus('success');
      console.log("=== SIGNUP PROCESS COMPLETED SUCCESSFULLY ===");

      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé et lié. Redirection vers la connexion...",
      });

      // Redirection vers la page de connexion avec un message
      setTimeout(() => {
        window.location.href = '/auth?message=account_created&email=' + encodeURIComponent(tenantData.email);
      }, 2000);

    } catch (error: any) {
      console.error("=== SIGNUP PROCESS FAILED ===", error);
      setLinkingStatus('failed');
      
      let errorMessage = "Une erreur s'est produite lors de la création du compte.";
      
      if (error.message.includes('already registered')) {
        errorMessage = "Un compte existe déjà avec cette adresse email.";
      } else if (error.message.includes('Email mismatch')) {
        errorMessage = "Erreur de sécurité : l'email ne correspond pas.";
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
            <span className="text-sm">Finalisation du compte...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Compte créé avec succès!</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Erreur lors de la création</span>
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
                        {linkingStatus === 'linking' ? 'Liaison en cours...' : 'Création du compte...'}
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
