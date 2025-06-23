
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface HeroProps {
  onShowAuthModal: () => void;
}

export default function OptimizedHero({ onShowAuthModal }: HeroProps) {
  const { t } = useLocale();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      {/* Gradient de fond simple et élégant */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50/30 to-blue-50/20" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
          
          {/* Boutons d'action */}
          <div 
            className="animate-fade-in flex flex-col sm:flex-row justify-center gap-4 mb-12"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <Button
              size="lg"
              onClick={onShowAuthModal}
              className="bg-gradient-to-r from-[#ea384c] to-[#d31c3f] hover:from-[#f04357] hover:to-[#e42349] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 py-6 transform hover:scale-105"
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
          
          {/* Image optimisée avec lazy loading */}
          <div 
            className="animate-fade-in w-full max-w-5xl mx-auto"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              {/* Placeholder pendant le chargement */}
              {!imageLoaded && (
                <div className="w-full h-96 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Chargement...</div>
                </div>
              )}
              
              <img 
                src="/lovable-uploads/4accfe08-d5fd-46dd-bd29-9b1d6db1687f.png"
                alt="PropManagement Dashboard Canada"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-auto transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
