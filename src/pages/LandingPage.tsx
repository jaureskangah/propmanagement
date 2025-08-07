
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
import { SimpleLogoDownloader } from "@/components/ui/SimpleLogoDownloader";
import { useState, Suspense } from "react";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoDownloader, setShowLogoDownloader] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white">
      <Header onShowAuthModal={() => setShowAuthModal(true)} />
      <div className="pt-16">
        {/* Above the fold - load immediately */}
        <OptimizedHero onShowAuthModal={() => setShowAuthModal(true)} />
        
        {/* Temporary Logo Download Button */}
        <div className="text-center py-4">
          <button 
            onClick={() => setShowLogoDownloader(true)}
            className="bg-[#ea384c] hover:bg-[#d31c3f] text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            🎨 Télécharger le Logo PropManagement
          </button>
        </div>
        
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
        
        
        {/* Temporary Logo Downloader */}
        {showLogoDownloader && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
              <button 
                onClick={() => setShowLogoDownloader(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <SimpleLogoDownloader />
            </div>
          </div>
        )}
        
        <Footer />
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
