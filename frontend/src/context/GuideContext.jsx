import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './AppContext';
import { TOUR_STEPS } from './tourSteps';

const GuideContext = createContext(null);

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

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stepParam = parseInt(params.get('step'), 10);
      if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= TOUR_STEPS.length) {
        return stepParam - 1;
      }
      return 0; // Default to 1st Step
    } catch {
      return 0;
    }
  });

  // Sync isGuideMode to sessionStorage so each fresh browser visit starts in Walkthrough Mode
  useEffect(() => {
    try {
      sessionStorage.setItem('myntra_walkthrough_mode', JSON.stringify(isGuideMode));
    } catch (err) {
      console.error('Failed to persist walkthrough mode:', err);
    }
  }, [isGuideMode]);

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

    // Smooth scroll to target element if present
    setTimeout(() => {
      if (targetStep?.targetElementId) {
        const el = document.getElementById(targetStep.targetElementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 250);
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
