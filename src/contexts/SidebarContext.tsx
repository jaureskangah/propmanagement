import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    console.error("❌ useSidebarContext must be used within a SidebarProvider");
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  console.log("🔍 SidebarProvider: Initializing");
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Simple mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // Changé de 768 à 1024 pour inclure les tablettes
      console.log("📱 Mobile check:", { width: window.innerWidth, isMobile: mobile });
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  console.log("🔍 SidebarProvider: Providing context", { isMobile, isMobileOpen });

  return (
    <SidebarContext.Provider value={{ isMobileOpen, setIsMobileOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};