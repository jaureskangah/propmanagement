import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bot, MessageCircle, User, Cpu } from "lucide-react";
import { AIAssistant } from "./AIAssistant";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();

  // Only show for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-red-500 text-white flex items-center justify-center"
              aria-label={t('openAIAssistant') || 'Ouvrir l\'Assistant IA'}
              onClick={() => console.log('DEBUG: isAuthenticated =', isAuthenticated, 'Button clicked')}
            >
              {/* TEST: Multiple icônes pour diagnostiquer */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <Bot className="h-6 w-6 text-white stroke-2" />
                <MessageCircle className="h-4 w-4 text-yellow-400 stroke-2" />
              </div>
              <span className="text-xs absolute bottom-0 text-black bg-white px-1">ICONS</span>
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="right" 
            className="w-[400px] sm:w-[540px] p-0 overflow-hidden border-l bg-gradient-to-b from-background/95 to-muted/30 backdrop-blur-xl"
          >
            <SheetHeader className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-background/80 to-muted/20">
              <SheetTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                {t('aiAssistant') || 'Assistant IA'}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground/80 mt-2">
                {t('aiAssistantDescription') || 'Votre assistant intelligent pour la gestion immobilière'}
              </SheetDescription>
            </SheetHeader>
            
            <div className="h-[calc(100vh-120px)] overflow-hidden">
              <AIAssistant />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}