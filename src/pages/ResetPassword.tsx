import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useLocale } from "@/components/providers/LocaleProvider";
import { ModernInput } from '@/components/ui/modern-input';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernAuthCard } from '@/components/ui/modern-auth-card';
import { motion } from 'framer-motion';

const formSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // Vérifier si nous avons les paramètres de réinitialisation
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      toast({
        title: t('error'),
        description: t('invalidResetLink'),
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [searchParams, navigate, toast, t]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('passwordResetSuccess'),
      });

      // Rediriger vers la page de connexion après un délai
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error("Password update error:", error);
      
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
          {t('resetPassword')}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-sm"
        >
          {t('enterNewPassword')}
        </motion.p>
      </div>

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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ModernInput
                      type={showPassword ? "text" : "password"}
                      placeholder={t('newPassword')}
                      icon={<Lock className="h-4 w-4" />}
                      rightIcon={showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      onRightIconClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ModernInput
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t('confirmNewPassword')}
                      icon={<Lock className="h-4 w-4" />}
                      rightIcon={showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            {!loading && t('updatePassword')}
          </ModernButton>
        </form>
      </Form>
    </ModernAuthCard>
  );
};

export default ResetPassword;