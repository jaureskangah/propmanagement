import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bot, X } from "lucide-react";
import { AIAssistant } from "./AIAssistant";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useFloatingBotAnimations } from "@/hooks/useFloatingBotAnimations";
import { WelcomeMessageBubble } from "./WelcomeMessageBubble";
import { useIsMobile } from "@/hooks/use-mobile";

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const { 
    animationState, 
    welcomeMessage, 
    triggerCelebration,
    closeWelcomeBubble,
    isAuthenticated 
  } = useFloatingBotAnimations();

  const handleWelcomeBubbleClose = () => {
    closeWelcomeBubble();
  };

  const handleBotClick = () => {
    setIsOpen(true);
    triggerCelebration();
  };

  return (
    <AnimatePresence>
      {animationState.isVisible && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ 
            opacity: 1, 
            scale: animationState.isCompact ? 0.7 : 1, 
            y: 0,
            transition: {
              type: "spring",
              damping: 20,
              stiffness: 300,
              scale: { duration: 0.3 }
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0, 
            y: 100,
            transition: { duration: 0.3 }
          }}
        >
          {/* Welcome Message Bubble */}
          <WelcomeMessageBubble
            isVisible={animationState.showWelcomeBubble}
            message={welcomeMessage}
            onClose={handleWelcomeBubbleClose}
            isAuthenticated={isAuthenticated}
          />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
              >
                <Button
                  size="lg"
                  onClick={handleBotClick}
                  className={`
                    ${animationState.isCompact ? 'h-12 w-12' : 'h-16 w-16'} 
                    rounded-full bg-gradient-to-br from-primary to-primary/80 text-white 
                    shadow-lg hover:shadow-xl transition-all duration-300 
                    flex items-center justify-center border-2 border-white/20
                    ${animationState.isBreathing ? 'animate-pulse-glow' : ''}
                    ${animationState.glowIntensity === 'high' ? 'animate-enhanced-glow' : ''}
                  `}
                  aria-label={t('openAIAssistant') || 'Ouvrir l\'Assistant IA'}
                  style={{
                    filter: animationState.glowIntensity === 'high' 
                      ? 'drop-shadow(0 0 20px hsl(var(--primary) / 0.6))'
                      : animationState.glowIntensity === 'medium'
                      ? 'drop-shadow(0 0 10px hsl(var(--primary) / 0.3))'
                      : 'drop-shadow(0 0 5px hsl(var(--primary) / 0.2))'
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Bot className={`${animationState.isCompact ? 'h-6 w-6' : 'h-8 w-8'} text-white stroke-2`} />
                  </motion.div>
                </Button>
              </motion.div>
            </SheetTrigger>
          
          <SheetContent 
            side="right" 
            className={`${
              isMobile 
                ? 'w-full h-full inset-0 max-w-none border-none' 
                : 'w-[400px] sm:w-[540px] border-l'
            } p-0 overflow-hidden bg-gradient-to-b from-background/95 to-muted/30 backdrop-blur-xl`}
          >
            <SheetHeader className={`${isMobile ? 'p-4 pb-3' : 'p-6 pb-4'} border-b border-border/50 bg-gradient-to-r from-background/80 to-muted/20`}>
              <SheetTitle className="flex items-center justify-between text-lg font-semibold">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  {t('aiAssistant') || 'Assistant IA'}
                </div>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground/80 mt-2">
                {t('aiAssistantDescription') || 'Votre assistant intelligent pour la gestion immobilière'}
              </SheetDescription>
            </SheetHeader>
            
            <div className={`${isMobile ? 'h-[calc(100vh-80px)]' : 'h-[calc(100vh-120px)]'} overflow-hidden`}>
              <AIAssistant />
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
      )}
    </AnimatePresence>
  );
}