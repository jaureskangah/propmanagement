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
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
              aria-label={t('openAIAssistant') || 'Ouvrir l\'Assistant IA'}
            >
              <Bot className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="right" 
            className="w-[400px] sm:w-[540px] p-0 overflow-hidden"
          >
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                {t('aiAssistant') || 'Assistant IA'}
              </SheetTitle>
              <SheetDescription>
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