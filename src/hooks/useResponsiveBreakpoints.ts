import { useEffect, useState } from 'react';

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  screenWidth: number;
}

/**
 * Hook avancé pour la gestion des breakpoints responsive
 * Fournit des informations détaillées sur la taille d'écran actuelle
 */
export const useResponsiveBreakpoints = (): BreakpointState => {
  const [breakpointState, setBreakpointState] = useState<BreakpointState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLarge: false,
    screenWidth: 0,
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      
      setBreakpointState({
        screenWidth: width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1440,
        isLarge: width >= 1440,
      });
    };

    // Initial check
    updateBreakpoints();

    // Listen for resize events
    window.addEventListener('resize', updateBreakpoints);
    
    return () => {
      window.removeEventListener('resize', updateBreakpoints);
    };
  }, []);

  return breakpointState;
};

/**
 * Hook pour détecter si l'utilisateur utilise un écran tactile
 */
export const useTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - Check for IE
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
};

/**
 * Hook combiné pour optimisations responsive
 */
export const useDeviceOptimizations = () => {
  const breakpoints = useResponsiveBreakpoints();
  const isTouchDevice = useTouchDevice();
  
  return {
    ...breakpoints,
    isTouchDevice,
    // Helpers pour les cas d'usage courants
    needsHamburgerMenu: breakpoints.isMobile || breakpoints.isTablet,
    needsCompactLayout: breakpoints.isMobile,
    shouldStackElements: breakpoints.isMobile,
    needsLargerTouchTargets: isTouchDevice && (breakpoints.isMobile || breakpoints.isTablet),
  };
};

/**
 * Hook pour calculer automatiquement les colonnes de grid responsive
 */
export const useResponsiveGrid = (
  mobileColumns: number = 1,
  tabletColumns: number = 2,
  desktopColumns: number = 3,
  largeColumns: number = 4
) => {
  const { isMobile, isTablet, isDesktop, isLarge } = useResponsiveBreakpoints();
  
  if (isLarge) return largeColumns;
  if (isDesktop) return desktopColumns;
  if (isTablet) return tabletColumns;
  return mobileColumns;
};