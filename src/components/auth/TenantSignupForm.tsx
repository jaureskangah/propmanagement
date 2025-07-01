
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const tenantSignupSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type TenantSignupFormValues = z.infer<typeof tenantSignupSchema>;

interface TenantSignupFormProps {
  tenantData: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    properties?: {
      name: string;
    };
  };
  invitationToken: string;
  onSuccess: () => void;
}

export const TenantSignupForm = ({ tenantData, invitationToken, onSuccess }: TenantSignupFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<TenantSignupFormValues>({
    resolver: zodResolver(tenantSignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: TenantSignupFormValues) => {
    try {
      setLoading(true);
      console.log("=== TENANT SIGNUP PROCESS - IMPROVED ===");
      console.log("Creating account for tenant:", tenantData.email);

      // 1. Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tenantData.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            is_tenant_user: true,
          },
          emailRedirectTo: `${window.location.origin}/tenant/dashboard`
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur retournée");
      }

      console.log("✅ User account created:", authData.user.id);

      // 2. Créer une transaction pour garantir la cohérence
      const { error: transactionError } = await supabase.rpc('link_tenant_profile', {
        p_tenant_id: tenantData.id,
        p_user_id: authData.user.id
      });

      if (transactionError) {
        console.error("Error linking tenant profile:", transactionError);
        throw new Error("Erreur lors de la liaison du profil locataire");
      }

      console.log("✅ Tenant profile linked successfully");

      // 3. Mettre à jour le statut de l'invitation
      console.log("Updating invitation status...");
      const { error: invitationError } = await supabase
        .from('tenant_invitations')
        .update({ status: 'accepted' })
        .eq('token', invitationToken);

      if (invitationError) {
        console.error("Error updating invitation status:", invitationError);
        // Ne pas bloquer le processus pour cette erreur
      } else {
        console.log("✅ Invitation status updated to 'accepted'");
      }

      // 4. Vérifier que la liaison a bien fonctionné
      const { data: verificationData, error: verificationError } = await supabase
        .from('tenants')
        .select('tenant_profile_id')
        .eq('id', tenantData.id)
        .single();

      if (verificationError || !verificationData?.tenant_profile_id) {
        console.error("❌ Verification failed - tenant profile not linked properly");
        throw new Error("La liaison du profil locataire a échoué");
      }

      console.log("✅ Verification successful - tenant profile linked:", verificationData.tenant_profile_id);

      toast({
        title: "Compte créé avec succès !",
        description: "Bienvenue dans votre espace locataire. Redirection en cours...",
      });

      // 5. Redirection après un délai
      setTimeout(() => {
        console.log("Redirecting to tenant dashboard...");
        window.location.href = '/tenant/dashboard';
      }, 2000);

    } catch (error: any) {
      console.error("Error in tenant signup:", error);
      
      let errorMessage = "Une erreur s'est produite lors de la création du compte.";
      
      if (error.message?.includes('already registered')) {
        errorMessage = "Cette adresse email est déjà utilisée.";
      } else if (error.message?.includes('weak password')) {
        errorMessage = "Le mot de passe n'est pas assez fort.";
      } else if (error.message?.includes('liaison')) {
        errorMessage = "Erreur lors de la liaison du profil. Veuillez contacter l'administrateur.";
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Votre prénom"
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Votre nom"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <FormLabel className="text-sm font-medium">Email</FormLabel>
          <p className="text-sm text-gray-600 mt-1">{tenantData.email}</p>
          <p className="text-xs text-gray-500">Cette adresse sera utilisée pour votre connexion</p>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Choisissez un mot de passe"
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
                  placeholder="Confirmez votre mot de passe"
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
  );
};
