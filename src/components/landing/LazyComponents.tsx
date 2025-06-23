
import { lazy } from 'react';

// Lazy load heavy components that aren't above the fold
export const LazyHowItWorks = lazy(() => import('./HowItWorks'));
export const LazyPricing = lazy(() => import('./Pricing'));
export const LazyFAQ = lazy(() => import('./FAQ'));
export const LazyContact = lazy(() => import('./Contact'));
export const LazyCallToAction = lazy(() => import('./CallToAction'));

// Loading component for better UX
export const SectionLoader = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea384c]"></div>
  </div>
);
