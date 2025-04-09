
import { useNavigate } from "react-router-dom";
import { NavLink } from "./NavLink";
import { BookOpen, HelpCircle, Mail, DollarSign, LayoutList, LogIn, LogOut, LayoutDashboard } from "lucide-react";

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
  const navigate = useNavigate();

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <>
      <NavLink 
        scrolled={scrolled} 
        onClick={() => onSectionClick('features')}
        icon={<LayoutList size={18} />}
        label={t('features')}
      />
      <NavLink 
        scrolled={scrolled} 
        onClick={() => onSectionClick('how-it-works')}
        icon={<BookOpen size={18} />}
        label={t('howItWorks')}
      />
      <NavLink 
        scrolled={scrolled} 
        onClick={() => onSectionClick('pricing')}
        icon={<DollarSign size={18} />}
        label={t('pricing')}
      />
      <NavLink 
        scrolled={scrolled} 
        onClick={() => onSectionClick('faq')}
        icon={<HelpCircle size={18} />}
        label={t('faq')}
      />
      <NavLink 
        scrolled={scrolled} 
        onClick={() => onSectionClick('contact')}
        icon={<Mail size={18} />}
        label={t('contact')}
      />

      {isAuthenticated ? (
        <>
          <NavLink 
            scrolled={scrolled} 
            onClick={handleDashboardClick}
            icon={<LayoutDashboard size={18} />}
            label={t('dashboard')}
          />
          <NavLink 
            scrolled={scrolled} 
            onClick={onSignOutClick}
            icon={<LogOut size={18} />}
            label={t('signOut')}
          />
        </>
      ) : (
        <NavLink 
          scrolled={scrolled} 
          onClick={onShowAuthModal}
          icon={<LogIn size={18} />}
          label={t('login')}
        />
      )}
    </>
  );
};
