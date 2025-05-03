
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import CallToAction from "@/components/landing/CallToAction";
import AuthModal from "@/components/auth/AuthModal";
import { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const notification = useNotification();
  const { t } = useLocale();

  useEffect(() => {
    // Afficher une notification de bienvenue après un court délai
    const timer = setTimeout(() => {
      notification.success(t('welcomeGeneric', { fallback: "Bienvenue sur PropManagement!" }));
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [notification, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white">
      <Header onShowAuthModal={() => setShowAuthModal(true)} />
      <div className="pt-16">
        <Hero onShowAuthModal={() => setShowAuthModal(true)} />
        <Features />
        <HowItWorks />
        <Pricing />
        <CallToAction onShowAuthModal={() => setShowAuthModal(true)} />
        <FAQ />
        <Contact />
        <Footer />
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
