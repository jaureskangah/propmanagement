
import { useNavigate } from "react-router-dom";
import { NavLink } from "./NavLink";

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
      >
        {t('features')}
      </NavLink>
      <NavLink 
        scrolled={scrolled} 
        onClick={() => onSectionClick('how-it-works')}
      >
        {t('howItWorks')}
      </NavLink>
      <NavLink 
        scrolled={scrolled} 
        onClick={() => onSectionClick('pricing')}
      >
        {t('pricing')}
      </NavLink>
      <NavLink 
        scrolled={scrolled} 
        onClick={() => onSectionClick('faq')}
      >
        {t('faq')}
      </NavLink>
      <NavLink 
        scrolled={scrolled} 
        onClick={() => onSectionClick('contact')}
      >
        {t('contact')}
      </NavLink>

      {isAuthenticated ? (
        <>
          <NavLink 
            scrolled={scrolled} 
            onClick={handleDashboardClick}
            className="ml-4"
          >
            {t('dashboard')}
          </NavLink>
          <NavLink 
            scrolled={scrolled} 
            onClick={onSignOutClick}
            className="text-red-500 hover:text-red-600"
          >
            {t('signOut')}
          </NavLink>
        </>
      ) : (
        <NavLink 
          scrolled={scrolled} 
          onClick={onShowAuthModal}
          className="ml-4 bg-[#ea384c] hover:bg-[#d31c3f] text-white py-2 px-4 rounded-md transition-colors"
        >
          {t('login')}
        </NavLink>
      )}
    </>
  );
};
