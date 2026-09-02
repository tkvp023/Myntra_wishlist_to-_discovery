import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './AppContext';
import { TOUR_STEPS } from './tourSteps';

const GuideContext = createContext(null);

const getStepIndexForRoute = (pathname, preferredIdx = 0) => {
  if (pathname === '/wishlist') {
    return 3; // Step 4: Wishlist Ratings
  }
  if (pathname.startsWith('/product')) {
    // If already on Step 5 (idx 4) or Step 6 (idx 5), preserve it; otherwise default to Step 5
    if (preferredIdx === 4 || preferredIdx === 5) {
      return preferredIdx;
    }
    return 4; // Step 5: Trust Dashboard
  }
  if (pathname === '/profile') {
    return 6; // Step 7: Review Submission
  }
  if (pathname === '/') {
    // If on homepage and preferred is Step 1 (0), Step 2 (1), or Step 3 (2), keep it
    if (preferredIdx === 0 || preferredIdx === 1 || preferredIdx === 2) {
      return preferredIdx;
    }
    return 0; // Step 1: Push Notification
  }
  return preferredIdx;
};

export function GuideProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSearchOpen, closeReviewModal } = useApp();

  // Guide Mode toggle state (defaults to true for assignment evaluators)
  const [isGuideMode, setIsGuideMode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'normal') return false;
      if (params.get('mode') === 'walkthrough' || params.get('mode') === 'guide') return true;
      const saved = sessionStorage.getItem('myntra_walkthrough_mode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Initialize step strictly connected to current URL route on load/reload
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stepParam = parseInt(params.get('step'), 10);
      if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= TOUR_STEPS.length) {
        return stepParam - 1;
      }
      const savedStep = sessionStorage.getItem('myntra_tour_current_step');
      const parsedSaved = savedStep !== null ? parseInt(savedStep, 10) : 0;
      return getStepIndexForRoute(window.location.pathname, parsedSaved);
    } catch {
      return 0;
    }
  });

  // Sync isGuideMode to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('myntra_walkthrough_mode', JSON.stringify(isGuideMode));
    } catch (err) {
      console.error('Failed to persist walkthrough mode:', err);
    }
  }, [isGuideMode]);

  // Sync currentStepIndex to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('myntra_tour_current_step', currentStepIndex.toString());
    } catch (err) {
      console.error('Failed to persist step index:', err);
    }
  }, [currentStepIndex]);

  // Bidirectional Synchronization: When user navigates on screen, keep Walkthrough Step strictly connected
  useEffect(() => {
    if (!isGuideMode) return;

    setCurrentStepIndex((prevIdx) => {
      const targetStep = TOUR_STEPS[prevIdx];
      // Check if current route matches the expected step route
      const isRouteMatching =
        (targetStep.route === '/' && location.pathname === '/') ||
        (targetStep.route === '/wishlist' && location.pathname === '/wishlist') ||
        (targetStep.route.startsWith('/product') && location.pathname.startsWith('/product')) ||
        (targetStep.route === '/profile' && location.pathname === '/profile');

      if (!isRouteMatching) {
        const syncedIdx = getStepIndexForRoute(location.pathname, prevIdx);
        return syncedIdx;
      }
      return prevIdx;
    });
  }, [location.pathname, isGuideMode]);

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  const goToStep = useCallback((index) => {
    if (index < 0 || index >= TOUR_STEPS.length) return;
    setCurrentStepIndex(index);

    // Always dismiss review modal overlay when switching steps
    if (closeReviewModal) {
      closeReviewModal();
    }

    const targetStep = TOUR_STEPS[index];
    if (targetStep && location.pathname !== targetStep.route) {
      navigate(targetStep.route);
    }

    // When navigating to Step 3 (Search Discovery), automatically open the search overlay
    if (index === 2) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }

    // Robust scroll runner: attempts scrolling the <main> container with staggered retries for network/render delays
    if (targetStep?.targetElementId) {
      const runScroll = () => {
        const el = document.getElementById(targetStep.targetElementId);
        const mainEl = document.querySelector('main');
        if (el && mainEl) {
          const mainRect = mainEl.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const targetTop = mainEl.scrollTop + (elRect.top - mainRect.top) - 15;
          mainEl.scrollTo({
            top: Math.max(0, targetTop),
            behavior: 'smooth'
          });
          return true;
        }
        return false;
      };

      // Staggered attempts to guarantee execution as DOM elements render
      runScroll();
      setTimeout(runScroll, 80);
      setTimeout(runScroll, 200);
      setTimeout(runScroll, 400);
      setTimeout(runScroll, 700);
      setTimeout(runScroll, 1100);
    }
  }, [location.pathname, navigate, setIsSearchOpen, closeReviewModal]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      goToStep(0); // Loop back to start
    }
  }, [currentStepIndex, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, goToStep]);

  const toggleGuideMode = useCallback((targetMode = null) => {
    setIsGuideMode((prev) => {
      const next = typeof targetMode === 'boolean' ? targetMode : !prev;
      if (next) {
        // When switching back to guide mode, navigate to current step route
        const targetStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
        if (targetStep && location.pathname !== targetStep.route) {
          navigate(targetStep.route);
        }
      }
      return next;
    });
  }, [currentStepIndex, location.pathname, navigate]);

  const value = {
    isGuideMode,
    toggleGuideMode,
    currentStepIndex,
    totalSteps: TOUR_STEPS.length,
    currentStep,
    nextStep,
    prevStep,
    goToStep
  };

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuide() {
  const context = useContext(GuideContext);
  if (!context) {
    return {
      isGuideMode: true,
      toggleGuideMode: () => {},
      currentStepIndex: 0,
      totalSteps: TOUR_STEPS.length,
      currentStep: TOUR_STEPS[0],
      nextStep: () => {},
      prevStep: () => {},
      goToStep: () => {}
    };
  }
  return context;
}
