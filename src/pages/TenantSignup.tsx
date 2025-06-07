
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
import { Loader2, CheckCircle } from 'lucide-react';

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
        toast({
          title: "Invitation invalide",
          description: "Ce lien d'invitation n'est pas valide ou a expiré.",
          variant: "destructive",
        });
        return;
      }

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

    try {
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
            tenant_id: tenantData.id, // Ajouter l'ID du locataire dans les métadonnées
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('Aucune donnée utilisateur retournée');
      }

      console.log("User created with ID:", signUpData.user.id);

      // Attendre un peu pour que le trigger de création du profil se termine
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Lier le profil du locataire au nouvel utilisateur
      console.log("Linking tenant profile:", tenantData.id, "to user:", signUpData.user.id);
      
      const { error: tenantUpdateError } = await supabase
        .from('tenants')
        .update({
          tenant_profile_id: signUpData.user.id
        })
        .eq('id', tenantData.id);

      if (tenantUpdateError) {
        console.error("Error linking tenant profile:", tenantUpdateError);
        throw tenantUpdateError;
      }

      // Mettre à jour l'invitation comme acceptée
      const { error: updateError } = await supabase
        .from('tenant_invitations')
        .update({
          status: 'accepted'
        })
        .eq('token', invitationToken);

      if (updateError) {
        console.error("Error updating invitation status:", updateError);
      }

      console.log("Tenant profile successfully linked!");

      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé et lié à votre profil locataire. Vous allez être redirigé.",
      });

      // Rediriger vers le dashboard locataire après 2 secondes
      setTimeout(() => {
        window.location.href = '/tenant/dashboard';
      }, 2000);

    } catch (error: any) {
      console.error("Error creating tenant account:", error);
      
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
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création du compte...
                      </>
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
