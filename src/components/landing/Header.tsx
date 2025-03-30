
import { Building2, List, DollarSign, Gift, LogIn, LogOut, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useLocale } from "../providers/LocaleProvider";
import { LanguageSelector } from "./LanguageSelector";
import { motion } from "framer-motion";

interface HeaderProps {
  onShowAuthModal: () => void;
}

export default function Header({ onShowAuthModal }: HeaderProps) {
  const { user, session, isAuthenticated } = useAuth();
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

  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
      const headerHeight = 64;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMobileMenuOpen(false);
    }
  };

  const NavLinks = () => (
    <>
      <motion.div 
        className={`flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors cursor-pointer font-medium ${scrolled ? 'text-slate-700' : ''}`}
        onClick={() => scrollToSection('everything-you-need')}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <List className="h-4 w-4" />
        <span>{t('features')}</span>
      </motion.div>
      <motion.div 
        className={`flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors cursor-pointer font-medium ${scrolled ? 'text-slate-700' : ''}`}
        onClick={() => scrollToSection('pricing')}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <DollarSign className="h-4 w-4" />
        <span>{t('pricing')}</span>
      </motion.div>
      <motion.div 
        className={`flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors cursor-pointer font-medium ${scrolled ? 'text-slate-700' : ''}`}
        onClick={() => scrollToSection('pricing')}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Gift className="h-4 w-4" />
        <span>{t('freeTrial')}</span>
      </motion.div>

      <div className="flex items-center gap-4">
        <LanguageSelector />
      </div>

      {isAuthenticated ? (
        <>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button 
              variant="ghost"
              className={`text-slate-600 hover:text-[#ea384c] hover:bg-slate-100 font-medium ${scrolled ? 'text-slate-700' : ''}`}
              onClick={handleDashboardClick}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              {t('dashboard')}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              className={`text-slate-600 hover:text-[#ea384c] hover:bg-slate-100 font-medium ${scrolled ? 'text-slate-700' : ''}`}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('signOut')}
            </Button>
          </motion.div>
        </>
      ) : (
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-[#ea384c] to-[#d31c3f] hover:from-[#f04357] hover:to-[#e42349] text-white shadow-md hover:shadow-lg transition-all duration-300"
            onClick={onShowAuthModal}
          >
            <LogIn className="h-4 w-4 mr-2" />
            {t('signIn')}
          </Button>
        </motion.div>
      )}
    </>
  );

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
          <motion.div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={handleHomeClick}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Building2 className="h-8 w-8 text-[#ea384c]" />
            <span className={`text-xl font-bold ${scrolled ? 'bg-gradient-to-r from-[#ea384c] to-[#d31c3f] bg-clip-text text-transparent' : 'text-black'}`}>
              PropManagement
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[385px] pt-16">
              <nav className="flex flex-col gap-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
