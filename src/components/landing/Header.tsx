import { Building2, List, DollarSign, Gift, LogIn, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface HeaderProps {
  onShowAuthModal: () => void;
}

export default function Header({ onShowAuthModal }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  });

  const handleDashboardClick = () => {
    if (profile?.is_tenant_user) {
      navigate("/tenant/maintenance");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Error signing out");
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
      const headerHeight = 64; // Hauteur du header en pixels
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
      <div 
        className="flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors cursor-pointer"
        onClick={() => scrollToSection('everything-you-need')}
      >
        <List className="h-4 w-4" />
        <span>Features</span>
      </div>
      <div 
        className="flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors cursor-pointer"
        onClick={() => scrollToSection('pricing')}
      >
        <DollarSign className="h-4 w-4" />
        <span>Pricing</span>
      </div>
      <div 
        className="flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors cursor-pointer"
        onClick={() => scrollToSection('pricing')}
      >
        <Gift className="h-4 w-4" />
        <span>Free Trial</span>
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <Button 
            variant="default" 
            size="sm"
            onClick={handleDashboardClick}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-slate-600 hover:text-[#ea384c]"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      ) : (
        <Button
          variant="default"
          size="sm"
          className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
          onClick={onShowAuthModal}
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      )}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-[#ea384c]" />
            <span className="text-xl font-bold text-black">PropManagement</span>
          </div>

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
    </header>
  );
}
