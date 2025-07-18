
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ModernAuthCard } from '@/components/ui/modern-auth-card';
import { motion } from 'framer-motion';

const Signup = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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
          {t('createOwnerAccount')}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-sm"
        >
          {t('ownerAccountDescription')}
        </motion.p>
      </div>

      <SignUpForm onSuccess={() => {}} />
    </ModernAuthCard>
  );
};

export default Signup;
