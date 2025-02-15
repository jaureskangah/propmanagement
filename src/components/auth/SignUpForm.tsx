
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { NameFields } from './form/NameFields';
import { EmailField } from './form/EmailField';
import { PasswordFields } from './form/PasswordFields';
import { TenantCheckbox } from './form/TenantCheckbox';
import { SignUpFormValues, signUpFormSchema } from './signUpValidation';

interface SignUpFormProps {
  onSuccess: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
      console.log('Starting signup process with values:', values);

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (signUpData?.user) {
        console.log('User created successfully:', signUpData.user);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: signUpData.user.id,
              first_name: values.firstName,
              last_name: values.lastName,
              email: values.email,
              is_tenant_user: values.isTenant,
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      }

      toast({
        title: 'Success',
        description: 'Please check your email to confirm your account.',
      });
      onSuccess();
    } catch (error) {
      console.error('Error in signup process:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <NameFields form={form} />
        <EmailField form={form} />
        <PasswordFields form={form} />
        <TenantCheckbox form={form} />
        
        <Button type="submit" className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
}
