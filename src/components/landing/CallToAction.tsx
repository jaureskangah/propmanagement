
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "../providers/LocaleProvider";

interface CallToActionProps {
  onShowAuthModal: () => void;
}

export default function CallToAction({ onShowAuthModal }: CallToActionProps) {
  const { t } = useLocale();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="bg-gradient-to-r from-[#ea384c] to-[#d41f32] rounded-xl md:rounded-2xl p-6 md:p-12 text-center text-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          {t('readyToStart')}
        </h2>
        <p className="text-red-100 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
          {t('joinOthers')}
        </p>
        <Button 
          size="lg" 
          className="w-full sm:w-auto group bg-white hover:bg-white/90 text-[#ea384c] border border-red-100"
          onClick={onShowAuthModal}
        >
          {t('startForFree')}
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
