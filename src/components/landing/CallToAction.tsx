
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "../providers/LocaleProvider";
import { motion } from "framer-motion";

interface CallToActionProps {
  onShowAuthModal: () => void;
}

export default function CallToAction({ onShowAuthModal }: CallToActionProps) {
  const { t } = useLocale();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <motion.div 
        className="bg-gradient-to-r from-[#ea384c] to-[#d41f32] rounded-xl md:rounded-2xl p-6 md:p-12 text-center text-white"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { 
            duration: 0.8,
            ease: "easeOut"
          }
        }}
        viewport={{ once: true, margin: "-100px" }}
        whileHover={{ 
          boxShadow: "0 20px 25px -5px rgba(234, 56, 76, 0.4), 0 10px 10px -5px rgba(234, 56, 76, 0.3)",
          transition: { duration: 0.3 }
        }}
      >
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.5,
              delay: 0.2
            }
          }}
          viewport={{ once: true }}
        >
          {t('readyToStart')}
        </motion.h2>
        <motion.p 
          className="text-red-100 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.5,
              delay: 0.4
            }
          }}
          viewport={{ once: true }}
        >
          {t('joinOthers')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.5,
              delay: 0.6
            }
          }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="lg" 
            className="w-full sm:w-auto group bg-white hover:bg-white/90 text-[#ea384c] border border-red-100"
            onClick={onShowAuthModal}
          >
            {t('ctaStartFree')}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "easeInOut"
              }}
            >
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
