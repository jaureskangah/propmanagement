
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
  return (
    <motion.div 
      whileHover={{ 
        translateY: -8,
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
          <div className="absolute top-0 left-0 w-full bg-[#ea384c] shadow-sm py-1">
            <p className="text-center text-sm font-medium text-white">
              {t('mostPopular')}
            </p>
          </div>
        )}
        <CardHeader className={`pb-0 ${popular ? 'pt-8' : 'pt-4'}`}>
          <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pt-4">
          <div className="mt-2 flex items-baseline">
            <span className="text-5xl font-extrabold tracking-tight text-gray-900 group-hover:scale-105 transition-transform duration-300">{formatPrice(price)}</span>
            <span className="ml-1 text-xl font-medium text-gray-600">/{t('month')}</span>
          </div>
          <ul className="mt-8 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className={`h-5 w-5 ${iconColor} mr-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-200`} />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pt-4">
          <Button 
            className={`w-full py-6 transition-all duration-300 ${
              popular 
                ? 'bg-[#ea384c] hover:bg-[#d41f32] text-white hover:scale-105 hover:shadow-lg' 
                : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:scale-105 hover:shadow-md'
            }`}
            onClick={() => onSubscribe(priceId)}
          >
            <span className="relative group">
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                {t(buttonText)}
              </span>
            </span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
