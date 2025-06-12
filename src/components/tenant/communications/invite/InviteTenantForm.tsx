
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Copy, ExternalLink } from 'lucide-react';
import { useInvitationService } from './useInvitationService';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);

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

    if (result.success && result.invitationUrl) {
      setInvitationUrl(result.invitationUrl);
      onSuccess?.();
    }
  };

  const copyToClipboard = async () => {
    if (invitationUrl) {
      try {
        await navigator.clipboard.writeText(invitationUrl);
        toast({
          title: "Lien copié",
          description: "Le lien d'invitation a été copié dans le presse-papiers.",
        });
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien.",
          variant: "destructive",
        });
      }
    }
  };

  const openInNewTab = () => {
    if (invitationUrl) {
      window.open(invitationUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {!invitationUrl ? (
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
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 mb-2">
              Invitation créée avec succès !
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Partagez ce lien avec le locataire pour qu'il puisse créer son compte :
            </p>
            <div className="bg-white p-3 rounded border text-sm font-mono break-all">
              {invitationUrl}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={copyToClipboard} variant="outline" className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              Copier le lien
            </Button>
            <Button onClick={openInNewTab} variant="outline" className="flex-1">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ouvrir
            </Button>
          </div>
          
          <Button 
            onClick={() => {
              setInvitationUrl(null);
              form.reset();
            }} 
            variant="ghost" 
            className="w-full"
          >
            Envoyer une nouvelle invitation
          </Button>
        </div>
      )}
    </div>
  );
};
