import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import { useLocale } from "@/components/providers/LocaleProvider";
import { ModernInput } from '@/components/ui/modern-input';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernAuthCard } from '@/components/ui/modern-auth-card';
import { motion } from 'framer-motion';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: t('success'),
        description: t('passwordResetEmailSent'),
      });

    } catch (error: any) {
      console.error("Password reset error:", error);
      
      toast({
        title: t('error'),
        description: t('passwordResetError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModernAuthCard>
      {/* Logo and header */}
      <div className="text-center space-y-1 mb-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden mb-4"
        >
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">P</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
        >
          {t('forgotPassword')}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-sm"
        >
          {emailSent ? t('checkEmailForReset') : t('enterEmailForReset')}
        </motion.p>
      </div>

      {!emailSent ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ModernInput
                        type="email"
                        placeholder={t('enterEmail')}
                        icon={<Mail className="h-4 w-4" />}
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <ModernButton
              type="submit"
              isLoading={loading}
              className="mt-6"
            >
              {!loading && t('sendResetEmail')}
            </ModernButton>
          </form>
        </Form>
      ) : (
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-green-300">
              ✅ {t('passwordResetEmailSent')}
            </p>
          </div>
          
          <p className="text-xs text-white/60">
            {t('checkSpamFolder')}
          </p>
        </motion.div>
      )}

      {/* Back to login link */}
      <motion.p 
        className="text-center text-xs text-white/60 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link 
          to="/login" 
          className="relative inline-flex items-center group/back"
        >
          <ArrowLeft className="w-3 h-3 mr-1 group-hover/back:-translate-x-1 transition-transform duration-300" />
          <span className="relative z-10 text-white group-hover/back:text-white/70 transition-colors duration-300 font-medium">
            {t('backToLogin')}
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/back:w-full transition-all duration-300" />
        </Link>
      </motion.p>
    </ModernAuthCard>
  );
};

export default ForgotPassword;