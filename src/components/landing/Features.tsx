
import { Building2, Users, Wrench, Shield } from "lucide-react";
import { useLocale } from "../providers/LocaleProvider";
import { motion } from "framer-motion";

export default function Features() {
  const { t } = useLocale();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div id="everything-you-need" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
        variants={container}
      >
        <motion.h2 
          variants={item}
          className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
        >
          {t('everythingYouNeed')}
        </motion.h2>
        <motion.p 
          variants={item}
          className="text-slate-600 text-lg max-w-2xl mx-auto"
        >
          {t('featuresSubtitle')}
        </motion.p>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={container}
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5 }
        }
      }}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      }}
      className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-red-100 shadow-lg transition-all duration-300 group"
    >
      <motion.div 
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </motion.div>
  );
}
