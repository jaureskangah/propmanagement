
import Header from "@/components/landing/Header";
import OptimizedHero from "@/components/landing/OptimizedHero";
import OptimizedFeatures from "@/components/landing/OptimizedFeatures";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/auth/AuthModal";
import { 
  LazyHowItWorks, 
  LazyPricing, 
  LazyFAQ, 
  LazyContact, 
  LazyCallToAction,
  SectionLoader 
} from "@/components/landing/LazyComponents";

import { useState, Suspense } from "react";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white">
      <Header onShowAuthModal={() => setShowAuthModal(true)} />
      <div className="pt-16">
        {/* Above the fold - load immediately */}
        <OptimizedHero onShowAuthModal={() => setShowAuthModal(true)} />
        
        <OptimizedFeatures />
        
        {/* Below the fold - lazy load with suspense */}
        <Suspense fallback={<SectionLoader />}>
          <LazyHowItWorks />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <LazyPricing />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <LazyCallToAction onShowAuthModal={() => setShowAuthModal(true)} />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <LazyFAQ />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <LazyContact />
        </Suspense>
        
        
        <Footer />
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
