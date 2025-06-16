
import { Building2, Users, Wrench, Shield } from "lucide-react";
import { useLocale } from "../providers/LocaleProvider";
import { motion, Variants } from "framer-motion";
import { FeatureCard } from "./features/FeatureCard";
import { containerVariants, itemVariants } from "./features/featuresAnimations";

export default function Features() {
  const { t } = useLocale();

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.4, 0, 0.6, 1] as const
      } 
    }
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.4, 0, 0.6, 1] as const
      } 
    }
  };

  return (
    <div id="everything-you-need" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
        variants={containerVariants}
      >
        <motion.h2 
          variants={titleVariants}
          className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
        >
          {t('everythingYouNeed')}
        </motion.h2>
        <motion.p 
          variants={subtitleVariants}
          className="text-slate-600 text-lg max-w-2xl mx-auto"
        >
          {t('featuresSubtitle')}
        </motion.p>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <FeatureCard
          icon={<Building2 className="text-[#ea384c]" />}
          title={t('propertyManagement')}
          description={t('propertyManagementDesc')}
        />
        <FeatureCard
          icon={<Users className="text-[#ea384c]" />}
          title={t('tenantManagement')}
          description={t('tenantManagementDesc')}
        />
        <FeatureCard
          icon={<Wrench className="text-[#ea384c]" />}
          title={t('maintenance')}
          description={t('maintenanceDesc')}
        />
        <FeatureCard
          icon={<Shield className="text-[#ea384c]" />}
          title={t('security')}
          description={t('securityDesc')}
        />
      </motion.div>
    </div>
  );
}
