
import { useState, useEffect, useRef } from 'react';
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
  const [scrollState, setScrollState] = useState({
    isScrollable: false,
    isScrolledFromTop: false,
    isScrolledToBottom: false,
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  // Détection intelligente du scroll
  useEffect(() => {
    const checkScrollState = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const { scrollTop, scrollHeight, clientHeight } = element;
      
      setScrollState({
        isScrollable: scrollHeight > clientHeight,
        isScrolledFromTop: scrollTop > 10,
        isScrolledToBottom: scrollTop >= scrollHeight - clientHeight - 10,
      });
    };

    if (isOpen && contentRef.current) {
      checkScrollState();
      const element = contentRef.current;
      element.addEventListener('scroll', checkScrollState);
      
      // Re-check when content changes (tab switch)
      const resizeObserver = new ResizeObserver(checkScrollState);
      resizeObserver.observe(element);
      
      return () => {
        element.removeEventListener('scroll', checkScrollState);
        resizeObserver.disconnect();
      };
    }
  }, [isOpen, activeTab]);

  // Smooth scroll to top when switching tabs
  const handleTabSwitch = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`sm:max-w-[425px] bg-black/40 backdrop-blur-xl border border-white/[0.05] text-white p-0 ${
          scrollState.isScrollable ? 'overflow-hidden' : ''
        }`} 
        style={{ maxHeight: '95vh', height: 'auto' }}
      >
        <div className="relative h-full">
          {/* Top fade indicator */}
          {scrollState.isScrollable && scrollState.isScrolledFromTop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none"
            />
          )}

          {/* Scrollable content */}
          <div
            ref={contentRef}
            className={`relative h-full ${
              scrollState.isScrollable 
                ? 'overflow-y-auto scrollbar-hide' 
                : ''
            }`}
            style={{ maxHeight: '95vh' }}
          >
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
                  onClick={() => handleTabSwitch('signin')}
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
                  onClick={() => handleTabSwitch('signup')}
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
            </div>
          </div>

          {/* Bottom fade indicator */}
          {scrollState.isScrollable && !scrollState.isScrolledToBottom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
