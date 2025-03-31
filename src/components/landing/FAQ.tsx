
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "../providers/LocaleProvider";
import { motion } from "framer-motion";

export default function FAQ() {
  const { t } = useLocale();

  const faqItems = [
    {
      question: t('faqHowToStart'),
      answer: t('faqHowToStartAnswer')
    },
    {
      question: t('faqFeatures'),
      answer: t('faqFeaturesAnswer')
    },
    {
      question: t('faqMultipleProperties'),
      answer: t('faqMultiplePropertiesAnswer')
    },
    {
      question: t('faqCommunication'),
      answer: t('faqCommunicationAnswer')
    },
    {
      question: t('faqSecurity'),
      answer: t('faqSecurityAnswer')
    },
    {
      question: t('faqExport'),
      answer: t('faqExportAnswer')
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section 
      className="py-12 md:py-20 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8 md:mb-16"
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
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.5,
                  ease: "easeOut"
                }
              }
            }}
          >
            {t('frequentlyAskedQuestions')}
          </motion.h2>
          <motion.p 
            className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.5,
                  delay: 0.1,
                  ease: "easeOut"
                }
              }
            }}
          >
            {t('findAnswers')}
          </motion.p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto px-0 sm:px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            {faqItems.map((item, index) => (
              <motion.div 
                key={index}
                variants={item}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="bg-white border border-red-100 rounded-lg px-3 md:px-4 hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-3 md:py-4 text-slate-900 font-medium text-sm md:text-base pr-2">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-sm md:text-base pb-3 md:pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </motion.section>
  );
}
