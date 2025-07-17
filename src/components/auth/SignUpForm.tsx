
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { NameFields } from './form/NameFields';
import { EmailField } from './form/EmailField';
import { PasswordFields } from './form/PasswordFields';
import { SignUpFormValues, signUpFormSchema } from './signUpValidation';
import { useNavigate, Link } from 'react-router-dom';
import { useLocale } from "@/components/providers/LocaleProvider";
import { ModernButton } from '@/components/ui/modern-button';
import { motion } from 'framer-motion';

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
            is_tenant_user: false,
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error(t('signUpError'));
      }

      // Send onboarding email in background
      try {
        await supabase.functions.invoke('user-onboarding-email', {
          body: {
            userId: data.user.id,
            email: data.user.email,
            firstName: values.firstName,
            lastName: values.lastName,
            isOwner: true, // This is the owner signup form
          },
        });
        console.log('Onboarding email sent successfully');
      } catch (emailError) {
        console.error('Failed to send onboarding email:', emailError);
        // Don't throw - email failure shouldn't block signup success
      }

      toast({
        title: t('signUpSuccess'),
        description: data.session ? 
          t('signUpSuccess') : 
          t('checkYourEmail'),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <NameFields form={form} disabled={loading} />
          <EmailField form={form} disabled={loading} />
          <PasswordFields form={form} disabled={loading} />
        </motion.div>
        
        <motion.div 
          className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-purple-200">
            ℹ️ {t('ownerSignupNote')}
          </p>
        </motion.div>
        
        <ModernButton
          type="submit"
          isLoading={loading}
          className="mt-6"
        >
          {!loading && t('createMyOwnerAccount')}
        </ModernButton>

        {/* Sign in link */}
        <motion.p 
          className="text-center text-xs text-white/60 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t('alreadyHaveAccount')}{' '}
          <Link 
            to="/login" 
            className="relative inline-block group/signin"
          >
            <span className="relative z-10 text-white group-hover/signin:text-white/70 transition-colors duration-300 font-medium">
              {t('signInCta')}
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signin:w-full transition-all duration-300" />
          </Link>
        </motion.p>
      </form>
    </Form>
  );
}
