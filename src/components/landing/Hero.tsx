
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onShowAuthModal: () => void;
}

export default function Hero({ onShowAuthModal }: HeroProps) {
  const { t } = useLocale();

  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      {/* Gradient de fond simple et élégant */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50/30 to-blue-50/20" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Titre principal */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight"
          >
            {t('heroTitle')}
          </motion.h1>
          
          {/* Sous-titre simplifié */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>
          
          {/* Boutons d'action */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
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
          </motion.div>
          
          {/* Image du dashboard avec animation subtile */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <img 
                src="/lovable-uploads/4accfe08-d5fd-46dd-bd29-9b1d6db1687f.png"
                alt="PropManagement Dashboard Canada" 
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
