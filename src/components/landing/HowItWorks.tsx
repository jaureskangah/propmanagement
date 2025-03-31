
import { ArrowRight, ListChecks, Building2, MessageSquare, Search } from "lucide-react";
import { useLocale } from "../providers/LocaleProvider";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const { t } = useLocale();

  const steps = [
    {
      icon: <ListChecks className="w-12 h-12 text-[#ea384c]" />,
      title: t("step1Title"),
      description: t("step1Description")
    },
    {
      icon: <Building2 className="w-12 h-12 text-[#ea384c]" />,
      title: t("step2Title"),
      description: t("step2Description")
    },
    {
      icon: <Search className="w-12 h-12 text-[#ea384c]" />,
      title: t("step3Title"),
      description: t("step3Description")
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-[#ea384c]" />,
      title: t("step4Title"),
      description: t("step4Description")
    }
  ];

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
    <motion.section 
      id="how-it-works" 
      className="py-20 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={item}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            {t("howItWorksTitle")}
          </motion.h2>
          <motion.p 
            variants={item}
            className="text-slate-600 text-lg max-w-2xl mx-auto"
          >
            {t("howItWorksSubtitle")}
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-4 gap-8 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="bg-white rounded-lg p-6 text-center relative z-10 h-full flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
                initial={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                whileHover={{ 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <motion.div 
                  className="mb-4 p-3 bg-red-50 rounded-xl"
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 5,
                    transition: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-600">
                  {step.description}
                </p>
              </motion.div>
              
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-0"
                  initial={{ x: -5, opacity: 0.3 }}
                  whileInView={{ 
                    x: [0, 5, 0], 
                    opacity: [0.3, 0.7, 0.3],
                    transition: { 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }
                  }}
                  viewport={{ once: true }}
                >
                  <ArrowRight className="w-8 h-8 text-[#ea384c]/30" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
