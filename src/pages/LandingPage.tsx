
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/auth/AuthModal";
import { useState } from "react";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white">
      <Header onShowAuthModal={() => setShowAuthModal(true)} />
      <div className="pt-16">
        <Hero onShowAuthModal={() => setShowAuthModal(true)} />
        <Features />
        <HowItWorks />
        <Pricing />
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
