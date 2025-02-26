
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { NameFields } from './form/NameFields';
import { EmailField } from './form/EmailField';
import { PasswordFields } from './form/PasswordFields';
import { TenantCheckbox } from './form/TenantCheckbox';
import { SignUpFormValues, signUpFormSchema } from './signUpValidation';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useLocale } from "@/components/providers/LocaleProvider";

interface SignUpFormProps {
  onSuccess: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLocale();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isTenant: false,
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            is_tenant_user: values.isTenant,
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error(t('noUserDataReturned'));
      }

      toast({
        title: t('signUpSuccess'),
        description: data.session ? 
          t('accountCreatedSuccess') : 
          t('verifyEmailPrompt'),
      });

      if (onSuccess) {
        onSuccess();
      }

      if (data.session) {
        navigate('/dashboard');
      }

    } catch (error: any) {
      let errorMessage = t('signUpError');
      
      if (error.message.includes('already registered')) {
        errorMessage = t('emailAlreadyRegistered');
      }

      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <NameFields form={form} disabled={loading} />
        <EmailField form={form} disabled={loading} />
        <PasswordFields form={form} disabled={loading} />
        <TenantCheckbox form={form} disabled={loading} />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('signingUp')}
            </>
          ) : (
            t('signUp')
          )}
        </Button>
      </form>
    </Form>
  );
}
