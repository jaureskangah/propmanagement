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
import { Bot } from "lucide-react";
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
              className="h-16 w-16 rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 bg-gradient-to-tr from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary border-0 relative overflow-hidden group animate-fade-in hover:scale-110 active:scale-95"
              aria-label={t('openAIAssistant') || 'Ouvrir l\'Assistant IA'}
            >
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary-glow/30 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              
              {/* Icon */}
              <img 
                src="/lovable-uploads/b05d95df-c338-4442-bcef-14617a9a5273.png" 
                alt="Assistant IA" 
                className="h-7 w-7 relative z-10 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-200"
              />
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="right" 
            className="w-[400px] sm:w-[540px] p-0 overflow-hidden border-l bg-gradient-to-b from-background/95 to-muted/30 backdrop-blur-xl"
          >
            <SheetHeader className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-background/80 to-muted/20">
              <SheetTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <img 
                    src="/lovable-uploads/b05d95df-c338-4442-bcef-14617a9a5273.png" 
                    alt="Assistant IA" 
                    className="h-5 w-5 object-contain"
                  />
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