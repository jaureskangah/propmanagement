import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useLocale } from '@/components/providers/LocaleProvider';

interface BotAnimationState {
  isVisible: boolean;
  isCompact: boolean;
  showWelcomeBubble: boolean;
  isBreathing: boolean;
  glowIntensity: 'low' | 'medium' | 'high';
  lastActivity: number;
}

export const useFloatingBotAnimations = () => {
  const { user } = useAuth();
  const { t } = useLocale();
  const isAuthenticated = !!user;
  const [animationState, setAnimationState] = useState<BotAnimationState>({
    isVisible: false,
    isCompact: false,
    showWelcomeBubble: false,
    isBreathing: true,
    glowIntensity: 'medium',
    lastActivity: Date.now(),
  });

  // Track scroll for compact mode
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const shouldBeCompact = scrollY > 100;
    
    setAnimationState(prev => ({
      ...prev,
      isCompact: shouldBeCompact,
      lastActivity: Date.now(),
    }));
  }, []);

  // Track mouse movement for activity
  const handleActivity = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      lastActivity: Date.now(),
    }));
  }, []);

  // Initialize bot visibility and welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        isVisible: true,
        showWelcomeBubble: true,
      }));
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Hide welcome bubble after delay - intelligent timing
  useEffect(() => {
    if (animationState.showWelcomeBubble) {
      // Different durations based on user status and activity
      const baseDuration = isAuthenticated ? 15000 : 20000; // 15s for authenticated, 20s for guests
      
      const timer = setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          showWelcomeBubble: false,
        }));
      }, baseDuration);

      return () => clearTimeout(timer);
    }
  }, [animationState.showWelcomeBubble, isAuthenticated]);

  // Hide welcome bubble early if user is very active
  useEffect(() => {
    if (animationState.showWelcomeBubble) {
      const now = Date.now();
      const timeSinceActivity = now - animationState.lastActivity;
      
      // If user has been active for more than 10 seconds, they're probably engaged
      if (timeSinceActivity < 1000 && animationState.lastActivity > 0) {
        const activityTimer = setTimeout(() => {
          const currentTime = Date.now();
          const totalActivityTime = currentTime - animationState.lastActivity;
          
          // If user has been consistently active for 8+ seconds, hide the bubble
          if (totalActivityTime > 8000) {
            setAnimationState(prev => ({
              ...prev,
              showWelcomeBubble: false,
            }));
          }
        }, 8000);

        return () => clearTimeout(activityTimer);
      }
    }
  }, [animationState.showWelcomeBubble, animationState.lastActivity]);

  // Set up scroll and activity listeners
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('click', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [handleScroll, handleActivity]);

  // Check for inactivity and show attention animation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - animationState.lastActivity;
      
      if (timeSinceActivity > 120000) { // 2 minutes
        setAnimationState(prev => ({
          ...prev,
          glowIntensity: 'high',
          isBreathing: true,
        }));
      } else if (timeSinceActivity > 60000) { // 1 minute
        setAnimationState(prev => ({
          ...prev,
          glowIntensity: 'medium',
        }));
      } else {
        setAnimationState(prev => ({
          ...prev,
          glowIntensity: 'low',
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [animationState.lastActivity]);

  const getWelcomeMessage = useCallback(() => {
    if (isAuthenticated && user) {
      return t('welcomeMessageAuthenticated');
    }
    return t('welcomeMessageGuest');
  }, [isAuthenticated, user, t]);

  const triggerCelebration = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      glowIntensity: 'high',
    }));
    
    setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        glowIntensity: 'medium',
      }));
    }, 2000);
  }, []);

  const triggerAttention = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      isBreathing: true,
      glowIntensity: 'high',
    }));
  }, []);

  const closeWelcomeBubble = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      showWelcomeBubble: false,
    }));
  }, []);

  return {
    animationState,
    welcomeMessage: getWelcomeMessage(),
    triggerCelebration,
    triggerAttention,
    closeWelcomeBubble,
    isAuthenticated,
  };
};