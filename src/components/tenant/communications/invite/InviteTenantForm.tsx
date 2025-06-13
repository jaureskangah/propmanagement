
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useInvitationService } from './useInvitationService';

const inviteSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteTenantFormProps {
  tenantId: string;
  defaultEmail?: string;
  onSuccess?: () => void;
}

export const InviteTenantForm = ({ tenantId, defaultEmail, onSuccess }: InviteTenantFormProps) => {
  const { sendInvitation, isLoading } = useInvitationService();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: defaultEmail || '',
    },
  });

  const onSubmit = async (values: InviteFormValues) => {
    console.log("Sending invitation to:", values.email, "for tenant:", tenantId);
    
    const result = await sendInvitation({
      email: values.email,
      tenantId: tenantId,
    });

    console.log("Invitation result:", result);

    if (result.success) {
      console.log("Invitation sent successfully, closing dialog");
      form.reset();
      onSuccess?.();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse email du locataire</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="locataire@exemple.com"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Envoyer l\'invitation'
          )}
        </Button>
      </form>
    </Form>
  );
};
