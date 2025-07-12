import { useEffect, useRef, useState } from 'react';

interface UseIntersectionAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionAnimation = (
  options: UseIntersectionAnimationOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce || !hasTriggered) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { elementRef, isVisible };
};

export const useStaggeredAnimation = (itemCount: number, delay: number = 0.1) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const { elementRef, isVisible } = useIntersectionAnimation();

  useEffect(() => {
    if (isVisible && visibleItems.length === 0) {
      const timeouts: NodeJS.Timeout[] = [];
      
      for (let i = 0; i < itemCount; i++) {
        const timeout = setTimeout(() => {
          setVisibleItems(prev => [...prev, i]);
        }, i * delay * 1000);
        
        timeouts.push(timeout);
      }

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [isVisible, itemCount, delay, visibleItems.length]);

  return { elementRef, visibleItems, isVisible };
};