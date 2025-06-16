
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PricingCardProps {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  priceId: string;
  popular?: boolean;
  gradient: string;
  borderColor: string;
  iconColor: string;
  onSubscribe: (priceId: string) => void;
  formatPrice: (price: string | number) => string;
  t: (key: string) => string;
}

export const PricingCard = ({
  name,
  price,
  features,
  buttonText,
  priceId,
  popular,
  gradient,
  borderColor,
  iconColor,
  onSubscribe,
  formatPrice,
  t
}: PricingCardProps) => {
  // Définir de nouvelles animations pour les cases à cocher et les items de la liste
  const checkIconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, rotate: [0, 5, -5, 0], transition: { duration: 0.4 } }
  };

  const featureItemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="h-full"
    >
      <Card 
        className={`relative h-full flex flex-col shadow-md transition-all duration-300 overflow-hidden
          bg-gradient-to-br ${gradient} ${popular ? `border-2 ${borderColor}` : 'border border-gray-200'}
          hover:shadow-xl group`}
      >
        {popular && (
          <motion.div 
            className="absolute top-0 left-0 w-full bg-[#ea384c] shadow-sm py-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <motion.p 
              className="text-center text-sm font-medium text-white"
              animate={{ 
                scale: [1, 1.05, 1],
                transition: { 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse" as const
                }
              }}
            >
              {t('mostPopular')}
            </motion.p>
          </motion.div>
        )}
        <CardHeader className={`pb-0 ${popular ? 'pt-8' : 'pt-4'}`}>
          <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pt-4">
          <motion.div 
            className="mt-2 flex items-baseline"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span 
              className="text-5xl font-extrabold tracking-tight text-gray-900 transition-transform duration-300"
              animate={{ 
                scale: popular ? [1, 1.05, 1] : 1,
                transition: { 
                  duration: popular ? 2 : 0,
                  repeat: popular ? Infinity : 0,
                  repeatType: "reverse" as const
                }
              }}
            >
              {formatPrice(price)}
            </motion.span>
            <span className="ml-1 text-xl font-medium text-gray-600">/{t('month')}</span>
          </motion.div>
          <motion.ul 
            className="mt-8 space-y-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {features.map((feature, index) => (
              <motion.li 
                key={feature} 
                className="flex items-center"
                variants={featureItemVariants}
                whileHover="hover"
                initial="initial"
              >
                <motion.div variants={checkIconVariants}>
                  <Check className={`h-5 w-5 ${iconColor} mr-2 flex-shrink-0 transition-transform duration-200`} />
                </motion.div>
                <span className="text-gray-700">{feature}</span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
        <CardFooter className="pt-4">
          <motion.div 
            className="w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className={`w-full py-6 transition-all duration-300 ${
                popular 
                  ? 'bg-[#ea384c] hover:bg-[#d41f32] text-white hover:scale-105 hover:shadow-lg' 
                  : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:scale-105 hover:shadow-md'
              }`}
              onClick={() => onSubscribe(priceId)}
            >
              <motion.span 
                className="relative group"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 10 }}
              >
                <span className="inline-block">
                  {t(buttonText)}
                </span>
              </motion.span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
