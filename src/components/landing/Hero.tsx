
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onShowAuthModal: () => void;
}

export default function Hero({ onShowAuthModal }: HeroProps) {
  const { t } = useLocale();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Nouvelle animation pour les éléments décoratifs
  const decorCircle = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { 
      scale: [0.8, 1.1, 0.9, 1],
      opacity: [0.5, 0.7, 0.6, 0.8],
      transition: { 
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse" 
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={container}
      className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50 to-white" />
      
      {/* Cercles décoratifs animés */}
      <motion.div 
        initial="initial"
        animate="animate"
        variants={decorCircle}
        className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gradient-to-r from-pink-100 to-red-100 opacity-30 blur-3xl" 
      />
      <motion.div 
        initial="initial"
        animate="animate"
        variants={{
          ...decorCircle,
          animate: {
            ...decorCircle.animate,
            transition: { ...decorCircle.animate.transition, delay: 1.5 }
          }
        }}
        className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-30 blur-3xl" 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
          >
            {t('heroTitle')}
          </motion.h1>
          
          <motion.p 
            variants={item}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>
          
          <motion.div 
            variants={item}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              onClick={onShowAuthModal}
              className="bg-gradient-to-r from-[#ea384c] to-[#d31c3f] hover:from-[#f04357] hover:to-[#e42349] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 py-6"
              // Ajout d'animation sur le bouton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('heroGetStarted')}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document
                  .getElementById("everything-you-need")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group border-gray-300 hover:border-[#ea384c] hover:text-[#ea384c] transition-colors rounded-full px-8 py-6"
              // Ajout d'animation sur le bouton
              as={motion.button}
              whileHover={{ scale: 1.05, borderColor: "#ea384c" }}
              whileTap={{ scale: 0.95 }}
            >
              {t('learnMore')}
              <ChevronDown className="h-4 w-4 group-hover:animate-bounce" />
            </Button>
          </motion.div>
          
          <motion.div 
            variants={item}
            whileInView={{ 
              scale: [0.96, 1.01, 1],
              opacity: [0.8, 1],
              transition: { duration: 1.2, ease: "easeOut" }
            }}
            className="w-full max-w-6xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden"
          >
            <motion.img 
              src="/lovable-uploads/4accfe08-d5fd-46dd-bd29-9b1d6db1687f.png"
              alt="PropManagement Dashboard Canada" 
              className="w-full h-auto rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
