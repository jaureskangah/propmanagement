
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
    <Card 
      className={`relative h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden
        bg-gradient-to-br ${gradient} ${popular ? `border-2 ${borderColor}` : 'border border-gray-200'}`}
    >
      {popular && (
        <div className="absolute top-5 left-0 right-0 text-center">
          <span className="inline-block py-1 px-4 bg-[#ea384c] text-white text-sm font-medium rounded-full shadow-sm">
            {t('mostPopular')}
          </span>
        </div>
      )}
      <CardHeader className={`pb-0 ${popular ? 'pt-12' : ''}`}>
        <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        <div className="mt-2 flex items-baseline">
          <span className="text-5xl font-extrabold tracking-tight text-gray-900">{formatPrice(price)}</span>
          <span className="ml-1 text-xl font-medium text-gray-600">/{t('month')}</span>
        </div>
        <ul className="mt-8 space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center">
              <Check className={`h-5 w-5 ${iconColor} mr-2 flex-shrink-0`} />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className={`w-full py-6 ${
            popular 
              ? 'bg-[#ea384c] hover:bg-[#d41f32] text-white' 
              : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
          } shadow-sm transition-colors duration-200`}
          onClick={() => onSubscribe(priceId)}
        >
          {t(buttonText)}
        </Button>
      </CardFooter>
    </Card>
  );
};
