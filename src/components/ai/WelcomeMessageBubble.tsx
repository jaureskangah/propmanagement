import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/providers/LocaleProvider';

interface WelcomeMessageBubbleProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  isAuthenticated: boolean;
}

export function WelcomeMessageBubble({ 
  isVisible, 
  message, 
  onClose, 
  isAuthenticated 
}: WelcomeMessageBubbleProps) {
  const { t } = useLocale();
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
              type: "spring",
              damping: 15,
              stiffness: 300
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            y: 20,
            transition: { duration: 0.3 }
          }}
          className="absolute bottom-20 right-0 w-80 p-4 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl"
          style={{
            boxShadow: `
              0 20px 25px -5px hsl(var(--primary) / 0.1),
              0 10px 10px -5px hsl(var(--primary) / 0.05),
              0 0 0 1px hsl(var(--border) / 0.1)
            `
          }}
        >
          {/* Arrow pointing to bot */}
          <div className="absolute bottom-[-8px] right-8 w-4 h-4 bg-background/95 border-r border-b border-border/50 transform rotate-45" />
          
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <motion.p 
                className="text-sm text-foreground/90 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.p>
              
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-3 flex gap-2"
                >
                  <Button 
                    size="sm" 
                    className="text-xs px-3 py-1 h-7"
                    onClick={() => window.location.href = '/auth'}
                  >
                    {t('signUp')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs px-3 py-1 h-7"
                    onClick={onClose}
                  >
                    {t('later')}
                  </Button>
                </motion.div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}