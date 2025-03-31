
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocale } from "../providers/LocaleProvider";
import { motion } from "framer-motion";
import { Logo } from "./header/Logo";
import { NavLinks } from "./header/NavLinks";
import { MobileMenu } from "./header/MobileMenu";
import { scrollToSection } from "./header/scrollUtils";

interface HeaderProps {
  onShowAuthModal: () => void;
}

export default function Header({ onShowAuthModal }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLocale();

  // Effet de détection du scroll pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  const handleDashboardClick = () => {
    console.log("Dashboard clicked, profile:", profile);
    try {
      if (profile?.is_tenant_user || user?.user_metadata?.is_tenant_user) {
        navigate("/tenant/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Dashboard navigation error:", error);
    }
  };

  const handleHomeClick = () => {
    console.log("Home clicked");
    try {
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Home navigation error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Error signing out");
    }
  };

  const handleSectionClick = (sectionId: string) => {
    const sectionScrolled = scrollToSection(sectionId);
    if (sectionScrolled) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo onClick={handleHomeClick} scrolled={scrolled} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks 
              t={t}
              scrolled={scrolled}
              isAuthenticated={isAuthenticated}
              onSectionClick={handleSectionClick}
              onShowAuthModal={onShowAuthModal}
              onDashboardClick={handleDashboardClick}
              onSignOutClick={handleSignOut}
            />
          </nav>

          {/* Mobile Navigation */}
          <MobileMenu 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          >
            <NavLinks 
              t={t}
              scrolled={scrolled}
              isAuthenticated={isAuthenticated}
              onSectionClick={handleSectionClick}
              onShowAuthModal={onShowAuthModal}
              onDashboardClick={handleDashboardClick}
              onSignOutClick={handleSignOut}
            />
          </MobileMenu>
        </div>
      </div>
    </motion.header>
  );
}
