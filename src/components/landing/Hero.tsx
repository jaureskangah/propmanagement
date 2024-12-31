import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onShowAuthModal: () => void;
}

export default function Hero({ onShowAuthModal }: HeroProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#ea384c] to-[#d41f32] bg-clip-text text-transparent animate-fade-in">
          Simplify Your Property Management
        </h1>
        <p className="text-slate-600 text-xl md:text-2xl max-w-3xl mx-auto animate-fade-in delay-100">
          A complete solution to manage your properties, tenants, and maintenance with ease.
        </p>
        <div className="flex justify-center gap-4 animate-fade-in delay-200">
          <Button 
            size="lg" 
            className="group bg-[#ea384c] hover:bg-[#d41f32] text-white"
            onClick={onShowAuthModal}
          >
            Get Started Now
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-white text-[#ea384c] border-red-100 hover:bg-red-50"
            onClick={onShowAuthModal}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}