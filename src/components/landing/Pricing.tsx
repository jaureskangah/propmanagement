
import { motion } from "framer-motion";
import { useLocale } from "../providers/LocaleProvider";
import { PricingCard } from "./pricing/PricingCard";
import { getPlans } from "./pricing/getPricingPlans";
import { formatPrice } from "./pricing/utils";
import { useSubscription } from "./pricing/useSubscription";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlanComparisonModal } from "./pricing/PlanComparisonModal";

export default function Pricing() {
  const { t, language } = useLocale();
  const plans = getPlans(t);
  const { handleSubscribe } = useSubscription(t);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Animation pour le titre et le sous-titre
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: [0.4, 0, 0.6, 1] as const
      }
    }
  };

  // Animation pour le bouton de comparaison
  const buttonVariants = {
    initial: { scale: 1, boxShadow: "0 4px 6px -1px rgba(234, 56, 76, 0.3)" },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 15px -3px rgba(234, 56, 76, 0.4)",
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.6, 1] as const
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.section 
      className="py-24 bg-gradient-to-b from-white to-gray-50" 
      id="pricing"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.h2 
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            variants={textVariants}
          >
            {t('pricingTitle')}
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-gray-600"
            variants={textVariants}
          >
            {t('pricingSubtitle')}
          </motion.p>
        </motion.div>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={item}>
              <PricingCard
                {...plan}
                onSubscribe={handleSubscribe}
                formatPrice={(price) => formatPrice(price, language)}
                t={t}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <motion.div variants={buttonVariants}>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setIsComparisonOpen(true)}
              className="bg-gradient-to-r from-[#ea384c] to-[#d41f32] text-white border-none hover:bg-gradient-to-r hover:from-[#d41f32] hover:to-[#c01226] transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <motion.span 
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 10 }}
              >
                {t('comparePlans')}
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        <PlanComparisonModal 
          isOpen={isComparisonOpen} 
          onClose={() => setIsComparisonOpen(false)} 
          plans={plans}
          t={t}
        />
      </div>
    </motion.section>
  );
}
