
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

interface HeroProps {
  onShowAuthModal: () => void;
}

export default function OptimizedHero({ onShowAuthModal }: HeroProps) {
  const { t } = useLocale();

  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      {/* FlickeringGrid en arrière-plan avec paramètres optimisés */}
      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="#ea384c"
        maxOpacity={0.4}
        flickerChance={0.2}
      />
      
      {/* Gradient léger pour ne pas masquer l'animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-red-50/20 to-blue-50/10 z-10" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Titre principal avec animation CSS pure */}
          <h1 className="animate-fade-in text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
            {t('heroTitle')}
          </h1>
          
          {/* Sous-titre avec délai d'animation */}
          <p 
            className="animate-fade-in text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            {t('heroSubtitle')}
          </p>
          
          {/* Boutons d'action avec un espacement optimisé */}
          <div 
            className="animate-fade-in flex flex-col sm:flex-row justify-center gap-4 mb-8"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <Button
              size="lg"
              onClick={onShowAuthModal}
              className="button-primary shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 py-6 transform hover:scale-105 ring-2 ring-primary/20 hover:ring-primary/40"
            >
              {t('heroGetStarted')}
            </Button>
            
            <button
              onClick={() => {
                document
                  .getElementById("everything-you-need")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-gray-600 hover:text-[#ea384c] transition-colors duration-200 group flex items-center justify-center gap-2 px-6 py-3"
            >
              {t('learnMore')}
              <ChevronDown className="h-4 w-4 group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
