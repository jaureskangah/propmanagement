import { useState } from "react";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import CallToAction from "@/components/landing/CallToAction";
import AuthModal from "@/components/auth/AuthModal";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white">
      <Header onShowAuthModal={() => setShowAuthModal(true)} />
      <div className="pt-16">
        <Hero onShowAuthModal={() => setShowAuthModal(true)} />
        <Features />
        <Pricing />
        <CallToAction onShowAuthModal={() => setShowAuthModal(true)} />
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}