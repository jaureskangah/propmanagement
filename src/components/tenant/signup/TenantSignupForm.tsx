
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const tenantSignupSchema = z.object({
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(6, 'La confirmation est requise'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type TenantSignupValues = z.infer<typeof tenantSignupSchema>;

interface TenantSignupFormProps {
  onSubmit: (values: TenantSignupValues) => void;
  loading: boolean;
  signupStatus: 'idle' | 'creating' | 'linking' | 'success' | 'failed';
}

export const TenantSignupForm = ({ onSubmit, loading, signupStatus }: TenantSignupFormProps) => {
  const form = useForm<TenantSignupValues>({
    resolver: zodResolver(tenantSignupSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  return (
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
  );
};
