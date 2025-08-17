import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';

interface BotAnimationState {
  isVisible: boolean;
  isCompact: boolean;
  showWelcomeBubble: boolean;
  isBreathing: boolean;
  glowIntensity: 'low' | 'medium' | 'high';
  lastActivity: number;
}

export const useFloatingBotAnimations = () => {
  const { isAuthenticated, user } = useAuth();
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

  // Hide welcome bubble after delay
  useEffect(() => {
    if (animationState.showWelcomeBubble) {
      const timer = setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          showWelcomeBubble: false,
        }));
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [animationState.showWelcomeBubble]);

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

  const getWelcomeMessage = () => {
    if (isAuthenticated && user) {
      const firstName = user.email?.split('@')[0] || 'utilisateur';
      return `Bonjour ${firstName} ! Je suis Acadie, votre assistant IA pour la gestion immobilière. Comment puis-je vous aider aujourd'hui ?`;
    }
    return "Bienvenue ! Découvrez notre assistant IA pour la gestion immobilière. Inscrivez-vous pour commencer à explorer toutes les fonctionnalités.";
  };

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

  return {
    animationState,
    welcomeMessage: getWelcomeMessage(),
    triggerCelebration,
    triggerAttention,
    isAuthenticated,
  };
};