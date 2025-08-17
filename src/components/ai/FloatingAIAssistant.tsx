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
import { Bot, MessageCircle, Cpu, Brain } from "lucide-react";
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
              className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center border-2 border-white/20"
              aria-label={t('openAIAssistant') || 'Ouvrir l\'Assistant IA'}
            >
              {/* Test de plusieurs icônes pour identifier le problème */}
              <div className="flex items-center justify-center">
                <Bot className="h-8 w-8 text-white stroke-2" />
                {!Bot && <MessageCircle className="h-8 w-8 text-white stroke-2" />}
                {!Bot && !MessageCircle && <Cpu className="h-8 w-8 text-white stroke-2" />}
              </div>
              <span className="text-xs absolute -bottom-1 text-black bg-white px-1 rounded">TEST</span>
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