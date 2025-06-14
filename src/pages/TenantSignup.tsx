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
  const [signupStatus, setSignupStatus] = useState<'idle' | 'creating' | 'linking' | 'success' | 'failed'>('idle');

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
      console.log("=== FETCHING TENANT DATA ===");
      console.log("Invitation token:", token);
      
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

      console.log("✅ Invitation found:", invitation);
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
    setSignupStatus('creating');

    try {
      console.log("=== STARTING TENANT SIGNUP ===");
      console.log("Creating account for:", tenantData.email);
      
      // D'abord, vérifier si l'utilisateur existe déjà
      const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === tenantData.email);
      
      if (existingUser) {
        console.log("User already exists, attempting direct login...");
        
        // Tentative de connexion directe
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: tenantData.email,
          password: values.password,
        });

        if (signInError) {
          console.error("Sign in failed:", signInError);
          toast({
            title: "Erreur de connexion",
            description: "Le compte existe mais le mot de passe est incorrect. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }

        if (signInData.user) {
          await linkTenantProfile(signInData.user.id);
          return;
        }
      }

      // Créer un nouveau compte avec email confirmé automatiquement
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: tenantData.email,
        password: values.password,
        options: {
          data: {
            first_name: tenantData.name.split(' ')[0] || '',
            last_name: tenantData.name.split(' ').slice(1).join(' ') || '',
            is_tenant_user: true,
            email_confirm: true, // Marquer l'email comme confirmé
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
      
      console.log("✅ User created successfully with ID:", signUpData.user.id);
      
      // Confirmer manuellement l'email si nécessaire
      if (!signUpData.user.email_confirmed_at) {
        console.log("Confirming email manually...");
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          signUpData.user.id,
          { email_confirm: true }
        );
        
        if (confirmError) {
          console.error("Error confirming email:", confirmError);
        }
      }
      
      // Lier le tenant au profil utilisateur
      await linkTenantProfile(signUpData.user.id);

    } catch (error: any) {
      console.error("=== SIGNUP PROCESS FAILED ===", error);
      setSignupStatus('failed');
      
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

  const linkTenantProfile = async (userId: string) => {
    try {
      setSignupStatus('linking');
      console.log("Starting tenant profile linking for user:", userId);

      // 1. Lier le tenant au profil utilisateur
      const { error: updateTenantError } = await supabase
        .from('tenants')
        .update({ 
          tenant_profile_id: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenantData.id)
        .eq('email', tenantData.email);

      if (updateTenantError) {
        console.error("Error updating tenant:", updateTenantError);
        throw new Error("Impossible de lier le profil au locataire");
      }

      console.log("✅ Tenant profile linked successfully");

      // 2. Créer ou mettre à jour le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: tenantData.email,
          first_name: tenantData.name.split(' ')[0] || '',
          last_name: tenantData.name.split(' ').slice(1).join(' ') || '',
          is_tenant_user: true,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error("Error creating/updating profile:", profileError);
      }

      console.log("✅ Profile created/updated successfully");

      // 3. Marquer l'invitation comme acceptée
      const { error: updateInvitationError } = await supabase
        .from('tenant_invitations')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('token', invitationToken);

      if (updateInvitationError) {
        console.error("Error updating invitation status:", updateInvitationError);
      }

      setSignupStatus('success');
      console.log("=== SIGNUP PROCESS COMPLETED SUCCESSFULLY ===");

      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé et activé. Redirection vers la connexion...",
      });

      // Forcer la déconnexion et rediriger vers la page de connexion
      setTimeout(async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth?message=account_created&email=' + encodeURIComponent(tenantData.email);
      }, 2000);

    } catch (error: any) {
      console.error("=== LINKING PROCESS FAILED ===", error);
      setSignupStatus('failed');
      throw error;
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

  const getStatusDisplay = () => {
    switch (signupStatus) {
      case 'creating':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Création du compte...</span>
          </div>
        );
      case 'linking':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Liaison du profil...</span>
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

              {signupStatus !== 'idle' && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  {getStatusDisplay()}
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
                    disabled={loading || signupStatus === 'success'}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {signupStatus === 'creating' ? 'Création...' : 
                         signupStatus === 'linking' ? 'Liaison...' : 'Traitement...'}
                      </>
                    ) : signupStatus === 'success' ? (
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
