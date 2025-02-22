
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "../providers/LocaleProvider";

interface HeroProps {
  onShowAuthModal: () => void;
}

export default function Hero({ onShowAuthModal }: HeroProps) {
  const { t } = useLocale();

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.querySelector('#how-it-works');
    howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center space-y-6 md:space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#ea384c] to-[#d41f32] bg-clip-text text-transparent animate-fade-in leading-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-slate-600 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto animate-fade-in delay-100 px-4">
          {t('heroSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-fade-in delay-200 px-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto group bg-[#ea384c] hover:bg-[#d41f32] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={onShowAuthModal}
          >
            {t('heroGetStarted')}
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto bg-white text-[#ea384c] border-red-100 hover:border-[#ea384c] shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={scrollToHowItWorks}
          >
            {t('learnMore')}
          </Button>
        </div>
      </div>
    </div>
  );
}
