import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  mobileClasses?: string;
  desktopClasses?: string;
  variant?: 'card' | 'form' | 'table' | 'metrics' | 'admin';
}

/**
 * ResponsiveWrapper - Composant utilitaire pour appliquer automatiquement
 * les classes responsive appropriées selon le contexte
 */
export const ResponsiveWrapper = ({ 
  children, 
  className = '', 
  mobileClasses = '',
  desktopClasses = '',
  variant 
}: ResponsiveWrapperProps) => {
  const isMobile = useIsMobile();
  
  // Classes automatiques selon la variante
  const getVariantClasses = () => {
    if (!variant) return '';
    
    const variantMap = {
      card: 'mobile-card-responsive mobile-card-hover mobile-touch-target',
      form: 'mobile-form-spacing mobile-property-form',
      table: 'mobile-table-responsive',
      metrics: 'mobile-metrics-grid mobile-metric-card',
      admin: 'mobile-admin-header mobile-admin-actions'
    };
    
    return isMobile ? variantMap[variant] || '' : '';
  };

  const finalClasses = cn(
    className,
    getVariantClasses(),
    isMobile ? mobileClasses : desktopClasses
  );

  return (
    <div className={finalClasses}>
      {children}
    </div>
  );
};

// Hook pour appliquer les classes responsive conditionnellement
export const useResponsiveClasses = (baseClasses: string, mobileClasses: string = '') => {
  const isMobile = useIsMobile();
  return cn(baseClasses, isMobile ? mobileClasses : '');
};

// Composants spécialisés pour des cas d'usage courants
export const ResponsiveCard = ({ children, className = '', ...props }: Omit<ResponsiveWrapperProps, 'variant'>) => (
  <ResponsiveWrapper variant="card" className={className} {...props}>
    {children}
  </ResponsiveWrapper>
);

export const ResponsiveForm = ({ children, className = '', ...props }: Omit<ResponsiveWrapperProps, 'variant'>) => (
  <ResponsiveWrapper variant="form" className={className} {...props}>
    {children}
  </ResponsiveWrapper>
);

export const ResponsiveTable = ({ children, className = '', ...props }: Omit<ResponsiveWrapperProps, 'variant'>) => (
  <ResponsiveWrapper variant="table" className={className} {...props}>
    {children}
  </ResponsiveWrapper>
);