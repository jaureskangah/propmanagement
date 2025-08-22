import { Check, ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getPlans } from "@/components/landing/pricing/getPricingPlans";
import { useState } from "react";
import { PlanComparisonModal } from "@/components/landing/pricing/PlanComparisonModal";

export default function Pricing() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [showComparison, setShowComparison] = useState(false);
  
  const plans = getPlans(t);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-8 text-gray-600 hover:text-[#ea384c] hover:border-[#ea384c]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToHome')}
          </Button>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('pricingTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('pricingSubtitle')}
          </p>
          <Button 
            variant="outline" 
            onClick={() => setShowComparison(true)}
            className="mb-12"
          >
            {t('comparePlans')}
          </Button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'ring-2 ring-[#ea384c] scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-[#ea384c] text-white text-sm font-medium py-2 text-center">
                    {t('mostPopular')}
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-gray-600 ml-2">/{t('month')}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className={`h-5 w-5 ${plan.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 ${
                      plan.popular 
                        ? 'bg-[#ea384c] hover:bg-[#d31c3f]' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/auth')}
                  >
                    {t(plan.buttonText)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('faqTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('faqCanChangeTitle')}</h3>
                <p className="text-gray-600">{t('faqCanChangeAnswer')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('faqSetupFeeTitle')}</h3>
                <p className="text-gray-600">{t('faqSetupFeeAnswer')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('faqPaymentMethodsTitle')}</h3>
                <p className="text-gray-600">{t('faqPaymentMethodsAnswer')}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('faqCancelTitle')}</h3>
                <p className="text-gray-600">{t('faqCancelAnswer')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('faqRefundsTitle')}</h3>
                <p className="text-gray-600">{t('faqRefundsAnswer')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('faqDataSecureTitle')}</h3>
                <p className="text-gray-600">{t('faqDataSecureAnswer')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#ea384c] to-[#d31c3f]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('ctaSubtitle')}
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
          >
            {t('startTrialNoCreditCard')}
          </Button>
        </div>
      </section>

      <PlanComparisonModal 
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        plans={plans}
        t={t}
      />
    </div>
  );
}