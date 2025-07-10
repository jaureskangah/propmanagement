
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLocale } from "@/components/providers/LocaleProvider";
import { ModernInput } from '@/components/ui/modern-input';
import { ModernButton } from '@/components/ui/modern-button';
import { motion } from 'framer-motion';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface SignInFormProps {
  onSuccess?: () => void;
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [searchParams] = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get('email') || '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      
      console.log("=== ATTEMPTING SIGN IN ===");
      console.log("Email:", values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }

      console.log("✅ Sign in successful:", data);

      toast({
        title: t('success'),
        description: t('signInSuccess'),
      });

      if (onSuccess) {
        onSuccess();
      }

      // Rediriger vers le bon dashboard selon le type d'utilisateur
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);

    } catch (error: any) {
      console.error("Sign in failed:", error);
      
      let errorMessage = t('invalidCredentials');
      
      if (error.message === 'Invalid login credentials') {
        errorMessage = t('invalidCredentials');
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
        {searchParams.get('message') === 'account_created' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm"
          >
            <p className="text-sm text-green-300">
              ✅ {t('signUpSuccess')} {t('pleaseEnterPassword')}
            </p>
          </motion.div>
        )}
        
        <motion.div className="space-y-4">
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
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ModernInput
                    type={showPassword ? "text" : "password"}
                    placeholder={t('enterPassword')}
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
        </motion.div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="appearance-none h-4 w-4 rounded border border-white/20 bg-white/5 checked:bg-white checked:border-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-200"
              />
              {rememberMe && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center text-black pointer-events-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </motion.div>
              )}
            </div>
            <label htmlFor="remember-me" className="text-xs text-white/60 hover:text-white/80 transition-colors duration-200 cursor-pointer">
              {t('rememberMe')}
            </label>
          </div>
          
          <div className="text-xs">
            <Link 
              to="/forgot-password" 
              className="relative inline-block text-white/60 hover:text-white transition-colors duration-200 cursor-pointer z-10"
            >
              <span className="relative z-10">
                {t('forgotPassword')}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white hover:w-full transition-all duration-300" />
            </Link>
          </div>
        </div>

        {/* Sign in button */}
        <ModernButton
          type="submit"
          isLoading={loading}
          className="mt-6"
        >
          {!loading && (
            <>
              {t('signIn')}
              <ArrowRight className="w-4 h-4 ml-1 group-hover/button:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </ModernButton>

        {/* Divider */}
        <div className="relative mt-6 mb-4 flex items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <motion.span 
            className="mx-3 text-xs text-white/40"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {t('or') || 'or'}
          </motion.span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Sign up link */}
        <motion.p 
          className="text-center text-xs text-white/60 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t('dontHaveAccount')}{' '}
          <Link 
            to="/signup" 
            className="relative inline-block group/signup"
          >
            <span className="relative z-10 text-white group-hover/signup:text-white/70 transition-colors duration-300 font-medium">
              {t('signUpCta')}
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signup:w-full transition-all duration-300" />
          </Link>
        </motion.p>
      </form>
    </Form>
  );
}
