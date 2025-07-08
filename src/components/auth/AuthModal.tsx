
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLocale } from '@/components/providers/LocaleProvider';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { motion } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const { t } = useLocale();

  // Debug logs pour comprendre le problème de scroll
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 AuthModal Debug: Modal opened');
      setTimeout(() => {
        const dialogContent = document.querySelector('[role="dialog"]');
        if (dialogContent) {
          const styles = window.getComputedStyle(dialogContent);
          console.log('🔍 AuthModal Debug: Dialog styles:', {
            height: styles.height,
            maxHeight: styles.maxHeight,
            overflow: styles.overflow,
            overflowY: styles.overflowY,
            scrollHeight: dialogContent.scrollHeight,
            clientHeight: dialogContent.clientHeight
          });
        }
      }, 100);
    }
  }, [isOpen, activeTab]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent bg-black/40 backdrop-blur-xl border border-white/[0.05] text-white p-0" style={{ maxHeight: '95vh', height: 'auto' }}>
        <div className="relative">
          {/* Background effects for modal */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-purple-700/30 to-black/50" />
          <div className="absolute inset-0 opacity-[0.03]" 
            style={{
              backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
              backgroundSize: '30px 30px'
            }}
          />
          
          <div className="relative p-6">
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
                {t('welcome')}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-sm"
              >
                {t('authDescription')}
              </motion.p>
            </div>

            {/* Modern Tabs */}
            <div className="flex bg-white/5 rounded-lg p-1 mb-6 backdrop-blur-sm border border-white/10">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 relative ${
                  activeTab === 'signin'
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {activeTab === 'signin' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-md"
                    transition={{ type: "spring", bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10">{t('signInCta')}</span>
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 relative ${
                  activeTab === 'signup'
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {activeTab === 'signup' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-md"
                    transition={{ type: "spring", bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10">{t('signUpCta')}</span>
              </button>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'signin' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'signin' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'signin' ? (
                <SignInForm onSuccess={onClose} />
              ) : (
                <SignUpForm onSuccess={onClose} />
              )}
            </motion.div>

            {/* Section de test pour forcer le dépassement et tester le scroll */}
            <div className="mt-8 p-4 border border-white/10 rounded-lg bg-white/5">
              <h3 className="text-white text-sm font-medium mb-2">Test de scroll</h3>
              <div className="space-y-2 text-white/60 text-xs">
                <p>Si vous voyez cette section, le modal est assez grand.</p>
                <p>Essayez de faire défiler vers le bas pour voir plus de contenu.</p>
                <p>Cette section sert à tester le comportement du scroll.</p>
                <p>Ligne 1 de test de contenu supplémentaire</p>
                <p>Ligne 2 de test de contenu supplémentaire</p>
                <p>Ligne 3 de test de contenu supplémentaire</p>
                <p>Ligne 4 de test de contenu supplémentaire</p>
                <p>Ligne 5 de test de contenu supplémentaire</p>
                <p>Ligne 6 de test de contenu supplémentaire</p>
                <p>Ligne 7 de test de contenu supplémentaire</p>
                <p>Ligne 8 de test de contenu supplémentaire</p>
                <p>Fin de la section de test - vous devriez pouvoir faire défiler jusqu'ici!</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
