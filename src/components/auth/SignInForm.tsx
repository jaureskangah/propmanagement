
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Lock } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface SignInFormProps {
  onSuccess: () => void;
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log('Starting signin process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error('Signin error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned from signin');
      }

      // Attendre que la session soit récupérée
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        throw new Error('No session available after signin');
      }

      // Get user profile to determine redirect
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_tenant_user')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      // Informer l'utilisateur
      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté.',
      });

      // Appeler onSuccess pour mettre à jour l'état global
      onSuccess();

      // Rediriger en fonction du type d'utilisateur
      if (profile?.is_tenant_user) {
        console.log('Redirecting tenant to maintenance...');
        navigate('/maintenance', { replace: true });
      } else {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      }

    } catch (error: any) {
      console.error('Error during signin:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de la connexion',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Enter your email" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input type="password" placeholder="Enter your password" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </form>
    </Form>
  );
}
