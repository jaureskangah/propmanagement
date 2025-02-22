
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../providers/LocaleProvider";

const formatPrice = (price: string | number) => {
  if (price === "Free") return price;
  return `CA$${price}`;
};

const getPlans = (t: (key: string) => string) => [
  {
    name: t('freemiumPlan'),
    price: "Free",
    features: [
      t('upTo2Properties'),
      t('rentManagement'),
      t('digitalDocuments'),
      t('basicPropertyCards'),
      t('emailNotifications'),
    ],
    buttonText: "pricingStartFree",
    priceId: null,
  },
  {
    name: t('proPlan'),
    price: "39.99",
    popular: true,
    features: [
      t('upTo5Properties'),
      t('rentManagement'),
      t('digitalDocuments'),
      t('tenantVerification'),
      t('prioritySupport'),
      t('advancedDashboard'),
      t('financialReports'),
      t('maintenanceManagement'),
    ],
    buttonText: "pricingGetStarted",
    priceId: "price_1QdEX1A44huL2zb1OfGwbzzn",
  },
  {
    name: t('enterprisePlan'),
    price: "99.99",
    features: [
      t('upTo20Properties'),
      t('rentManagement'),
      t('digitalDocuments'),
      t('tenantVerification'),
      t('dedicatedSupport'),
      t('customDashboard'),
      t('advancedFinancialReports'),
      t('maintenanceManagement'),
      t('userTraining'),
      t('dailyBackup'),
    ],
    buttonText: "pricingGetStarted",
    priceId: "price_1QdEXVA44huL2zb1cvLhmUtK",
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

  return (
    <section className="py-24 bg-gray-50" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('pricingTitle')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('pricingSubtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular ? 'border-[#ea384c] shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#ea384c] text-white text-sm font-medium px-3 py-1 rounded-full">
                    {t('mostPopular')}
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mt-2 flex items-baseline text-gray-900">
                  {plan.price === "Free" ? (
                    <span className="text-4xl font-bold tracking-tight">{t('free')}</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold tracking-tight">{formatPrice(plan.price)}</span>
                      <span className="ml-1 text-sm font-semibold">{t('month')}</span>
                    </>
                  )}
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-[#ea384c] hover:bg-[#d41f32] text-white"
                  onClick={() => handleSubscribe(plan.priceId)}
                >
                  {t(plan.buttonText)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
