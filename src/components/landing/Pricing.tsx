
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../providers/LocaleProvider";
import { motion } from "framer-motion";

const formatPrice = (price: string | number) => {
  return `$${price}`;
};

const getPlans = (t: (key: string) => string) => [
  {
    name: t('freemiumPlan'),
    price: "15",
    features: [
      t('upTo2Properties'),
      t('basicPropertyCards'),
      t('rentManagement'),
      t('digitalDocuments'),
      t('emailNotifications'),
    ],
    buttonText: "pricingStartFree",
    priceId: "price_basic",
    gradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
  },
  {
    name: t('proPlan'),
    price: "35",
    popular: true,
    features: [
      t('upTo5Properties'),
      t('tenantVerification'),
      t('advancedDashboard'),
      t('prioritySupport'),
    ],
    buttonText: "pricingGetStarted",
    priceId: "price_standard",
    gradient: "from-red-50 to-pink-100",
    borderColor: "border-[#ea384c]",
    iconColor: "text-[#ea384c]",
  },
  {
    name: t('enterprisePlan'),
    price: "60",
    features: [
      t('upTo20Properties'),
      t('financialReports'),
      t('maintenanceManagement'),
      t('customDashboard'),
      t('dedicatedSupport'),
    ],
    buttonText: "pricingGetStarted",
    priceId: "price_pro",
    gradient: "from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
    iconColor: "text-purple-500",
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLocale();
  const plans = getPlans(t);

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) {
      navigate("/dashboard");
      return;
    }

    if (!user) {
      toast({
        title: t('authRequired'),
        description: t('pleaseSignInToSubscribe'),
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: t('processing'),
        description: t('preparingPaymentSession'),
      });

      console.log('Creating checkout session for price:', priceId);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: t('error'),
          description: error.message || t('failedToCreateSession'),
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        console.log('Redirecting to checkout URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received');
        toast({
          title: t('error'),
          description: t('failedToCreateSessionNoUrl'),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: t('error'),
        description: error.message || t('generalError'),
        variant: "destructive",
      });
    }
  };

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
              <Card 
                className={`relative h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden
                  bg-gradient-to-br ${plan.gradient} ${plan.popular ? `border-2 ${plan.borderColor}` : 'border border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -right-12 top-8 w-40 transform rotate-45 bg-[#ea384c] shadow-md">
                    <p className="py-1 text-center text-sm font-medium text-white">
                      {t('mostPopular')}
                    </p>
                  </div>
                )}
                <CardHeader className="pb-0">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                  <div className="mt-2 flex items-baseline">
                    <span className="text-5xl font-extrabold tracking-tight text-gray-900">{formatPrice(plan.price)}</span>
                    <span className="ml-1 text-xl font-medium text-gray-600">/{t('month')}</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className={`h-5 w-5 ${plan.iconColor} mr-2 flex-shrink-0`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    className={`w-full py-6 ${
                      plan.popular 
                        ? 'bg-[#ea384c] hover:bg-[#d41f32] text-white' 
                        : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
                    } shadow-sm transition-colors duration-200`}
                    onClick={() => handleSubscribe(plan.priceId)}
                  >
                    {t(plan.buttonText)}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
