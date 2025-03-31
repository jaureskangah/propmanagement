
import { DollarSign, Gift, List } from "lucide-react";
import { NavLink } from "./NavLink";
import { LanguageSelector } from "../LanguageSelector";
import { AuthButtons } from "./AuthButtons";

interface NavLinksProps {
  t: (key: string) => string;
  scrolled: boolean;
  isAuthenticated: boolean;
  onSectionClick: (sectionId: string) => void;
  onShowAuthModal: () => void;
  onDashboardClick: () => void;
  onSignOutClick: () => void;
}

export const NavLinks = ({ 
  t, 
  scrolled, 
  isAuthenticated, 
  onSectionClick, 
  onShowAuthModal,
  onDashboardClick,
  onSignOutClick
}: NavLinksProps) => {
  return (
    <>
      <NavLink 
        icon={<List className="h-4 w-4" />} 
        label={t('features')} 
        onClick={() => onSectionClick('everything-you-need')} 
        scrolled={scrolled}
      />
      <NavLink 
        icon={<DollarSign className="h-4 w-4" />} 
        label={t('pricing')} 
        onClick={() => onSectionClick('pricing')} 
        scrolled={scrolled}
      />
      <NavLink 
        icon={<Gift className="h-4 w-4" />} 
        label={t('freeTrial')} 
        onClick={() => onSectionClick('pricing')} 
        scrolled={scrolled}
      />

      <div className="flex items-center gap-4">
        <LanguageSelector />
      </div>

      <AuthButtons 
        isAuthenticated={isAuthenticated}
        t={t}
        onSignInClick={onShowAuthModal}
        onDashboardClick={onDashboardClick}
        onSignOutClick={onSignOutClick}
      />
    </>
  );
};
