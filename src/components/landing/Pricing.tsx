
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
  const { t } = useLocale();
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

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('pricingTitle')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('pricingSubtitle')}
          </p>
        </div>
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
                formatPrice={formatPrice}
                t={t}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setIsComparisonOpen(true)}
            className="bg-gradient-to-r from-[#ea384c] to-[#d41f32] text-white border-none hover:bg-gradient-to-r hover:from-[#d41f32] hover:to-[#c01226] transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            {t('comparePlans')}
          </Button>
        </div>

        <PlanComparisonModal 
          isOpen={isComparisonOpen} 
          onClose={() => setIsComparisonOpen(false)} 
          plans={plans}
          t={t}
        />
      </div>
    </section>
  );
}
