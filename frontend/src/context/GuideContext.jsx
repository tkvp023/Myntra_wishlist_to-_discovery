import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './AppContext';

const GuideContext = createContext(null);

export const TOUR_STEPS = [
  {
    id: 'step_notification',
    stepNumber: 1,
    title: '1. Trust Milestone Push Notification',
    subtitle: 'In-App Re-Engagement Alert',
    route: '/',
    targetElementId: 'in-app-notification-banner',
    badgeText: 'Push Alert',
    description:
      'When a wishlisted item crosses verified buyer consensus, an ambient in-app banner notifies the shopper with the single highest-confidence signal (e.g. "93% of verified buyers confirm this feels genuine").',
    actionPrompt: 'Tap on the notification banner to deep-link directly into verified reviews on that product page.',
    researchMetric: 'Smart Alert Alternation',
    researchHeading: 'Notification Hierarchy & Co-existence',
    researchQuote:
      'Milestone alerts integrate into Myntra\'s existing notification engine alongside Price Drops and Sale Reminders without increasing overall frequency. Stalled high-intent items are re-engaged through quality validation rather than discount erosion.',
    keyPoints: [
      'Priority Hierarchy: Same-day Price Drop notifications take precedence over Trust Milestone alerts.',
      'Consensus Requirement: Only items with verified positive buyer confirmation qualify for push triggers.',
      'Direct Routing: Deep-links straight to the relevant verified review filter on the product page.'
    ]
  },
  {
    id: 'step_homepage',
    stepNumber: 2,
    title: '2. Homepage Trust Milestones',
    subtitle: 'Midpoint Shelf & Visual Isolation',
    route: '/',
    targetElementId: 'saved-items-section',
    badgeText: 'Homepage Discovery',
    description:
      'The "Saved Items with Trust Milestones" shelf surfaces stalled wishlist items with aggregated ratings. The highest-trust item features a warm coral border (#FF6B4A) and "Trending pick" label.',
    actionPrompt: 'Tap the Roadster Shirt card to view its product page and detailed trust dashboard.',
    researchMetric: 'Von Restorff Isolation',
    researchHeading: 'Homepage Visual Hierarchy',
    researchQuote:
      'Placing the highest-confidence saved item in subtle visual isolation draws natural attention at the homepage midpoint without disrupting catalog browsing or feeling like an aggressive promotion.',
    keyPoints: [
      'Isolation Accent: 1-2px warm coral accent border applied only to the #1 confidence item.',
      'Compact Dual Metrics: Surfaces 2 key signals (e.g. 93% Genuine · 85% Fits) at a single glance.',
      'Category Integration: General catalog cards display the single strongest positive badge.'
    ]
  },
  {
    id: 'step_search',
    stepNumber: 3,
    title: '3. Search Discovery & Wishlist Markers',
    subtitle: 'Native Type-Ahead & Results Markers',
    route: '/',
    targetElementId: 'top-search-bar',
    badgeText: 'Search Discovery',
    description:
      'During typing, suggestions remain 100% native with zero wishlist intrusion. On the results grid, saved products display an inline [🤍 Wishlisted] tile marker with thumbnail and price only.',
    actionPrompt: 'Tap Search or type "shirts" to observe the inline wishlist marker on matching items.',
    researchMetric: 'Zero Search Intrusion',
    researchHeading: 'Detail Scales with User Intent',
    researchQuote:
      'The further a touchpoint is from the checkout decision, the cleaner the signal must be. Detailed trust percentages are withheld during search discovery to avoid cluttering search results.',
    keyPoints: [
      'Type-Ahead Cleanliness: Zero injected prompts or badges during keyword suggestion stage.',
      'Grid Marker: Subtle [🤍 Wishlisted] badge identifies saved items within standard results.',
      'Information Staging: Full trust dashboards are reserved for the PDP due-diligence stage.'
    ]
  },
  {
    id: 'step_wishlist',
    stepNumber: 4,
    title: '4. Wishlist Trust Signals & Intent Tagging',
    subtitle: 'Curated Stats, On-Demand Expansion & Collections',
    route: '/wishlist',
    targetElementId: 'wishlist-tags-section',
    badgeText: 'Wishlist Features',
    description:
      'The first 4 cards in the wishlist auto-display their top 1-2 verified stats. Items beyond the top 4 feature a [View Trust Stats] toggle. The [+ Tag] button lets shoppers categorize items into intent collections.',
    actionPrompt: 'Inspect the top 4 cards, tap [View Trust Stats] on item 5, or tap [+ Tag] to filter by collection.',
    researchMetric: '94.4% Active Purchase Intent',
    researchHeading: 'Organizing High-Intent Demand',
    researchQuote:
      'With 94.4% of wishlist adds reflecting active purchase intent (84.4% genuine intent + 10.0% comparison shortlisting; Q1, n=8,182), intent tagging helps users separate immediate-purchase items from the smaller aspirational/gift segment (~1.8% combined). This keeps quality-doubt resolution (48.7% top blocker) focused on the items that actually need it, rather than diluted across the whole list.',
    keyPoints: [
      'Top-4 Auto Display: First 4 items display top 1-2 positive stats (≥70% consensus) automatically.',
      'On-Demand Expansion: Items 5+ use a collapsible toggle to preserve clean vertical scrolling.',
      'Intent Segmentation: Separates active 94.4% purchase intent from 1.8% aspirational items.',
      '1-Tap Explainability: Tapping any trust badge pill deep-links straight into verified reviews.'
    ]
  },
  {
    id: 'step_pdp_dashboard',
    stepNumber: 5,
    title: '5. PDP Trust-Verified Dashboard',
    subtitle: 'Wireframe-Matched Metric Carousel',
    route: '/product/prod_1',
    targetElementId: 'trust-dashboard-section',
    badgeText: 'Trust Dashboard',
    description:
      'A horizontal carousel of centered vertical cards displaying large iconic glyphs (Shield, Camera, Layers, ThumbsUp), bold emerald percentages, and descriptive attribute labels.',
    actionPrompt: 'Tap any stat card (e.g. "Matches Photos") to filter customer reviews below.',
    researchMetric: '48.7% Quality Doubt (#1 Blocker)',
    researchHeading: 'Neutralizing #1 Top Blocker',
    researchQuote:
      'Myntra already has an established review collection system where customer purchases are verified. Our trust badges hook directly into this existing verified-buyer review pipeline with lightweight structured prompts, seamlessly neutralizing 48.7% Quality Doubt (#1 ranked opportunity area, 4,617 mentions) without adding customer friction.',
    keyPoints: [
      'Existing System Integration: Hooks directly into Myntra\'s verified-buyer review pipeline without creating a separate system.',
      'Wireframe Alignment: Centered icon, emerald percentage headline, and clean bottom descriptor.',
      'Interactive Slice: Tapping any card instantly filters the customer review list below.',
      'Low-Sample Momentum: Displays trending discovery phrasing for newly listed SKUs.'
    ]
  },
  {
    id: 'step_badge_filtering',
    stepNumber: 6,
    title: '6. Review Filtering & Customer UGC Photos',
    subtitle: 'Natural Lighting Lightbox & Verified Badges',
    route: '/product/prod_1',
    targetElementId: 'reviews-filter-section',
    badgeText: 'Review Verification',
    description:
      'Filter chips allow slicing reviews by specific trust dimensions. The customer photo gallery features a full-screen lightbox with a "Natural Lighting" badge tag.',
    actionPrompt: 'Tap any photo thumbnail to inspect daylight proof, or toggle filter chips.',
    researchMetric: 'Daylight UGC Proof',
    researchHeading: 'Verified Buyer Proof & Natural Light',
    researchQuote:
      'Shoppers place highest confidence in unedited customer photos taken in daylight over catalog studio lighting. Surfacing lighting tags alongside Myntra-verified buyer badges removes the final hesitation barrier.',
    keyPoints: [
      'Verified Buyer Authenticity: Myntra\'s delivery tracking verifies real purchasers, attaching authentic badge tags to individual reviews.',
      'Attribute Filter Chips: 1-tap filtering for Authenticity, Photo Match, Fabric, and Stars.',
      'Lighting Metadata: Flags daylight environment for unedited texture and color accuracy.'
    ]
  },
  {
    id: 'step_review_submission',
    stepNumber: 7,
    title: '7. Post-Purchase Review & Verified Badge Collection',
    subtitle: 'Delivered Orders & Review Trigger Location',
    route: '/profile',
    targetElementId: 'orders-review-trigger',
    badgeText: 'Review Submission',
    description:
      'Reviewing is located in Myntra under Profile → Orders for delivered purchases. Customers tap the review trigger on their delivered order to provide structured attribute feedback and post unedited UGC photos/videos.',
    actionPrompt: 'Look at the highlighted [⭐ Rate & Submit Badges] button on the delivered order below, then tap it to open the review form.',
    researchMetric: 'Verified Buyer Data Integrity',
    researchHeading: 'Post-Purchase Trust Data Collection',
    researchQuote:
      'Myntra already has an established review collection pipeline for delivered orders. This screen demonstrates how lightweight structured attribute questions hook into that flow to populate the community Trust Dashboard.',
    keyPoints: [
      'Delivered Purchase Gating: Reviewing is restricted to verified delivered orders to guarantee 100% data authenticity.',
      'All Badge Options Visible: Every attribute question lays out all choices clearly as accessible buttons.',
      'Photo & Video UGC: Reviewers can upload unedited pictures and video clips with daylight tags.',
      'Approximation Disclaimer: This screen is an approximation of how a Myntra review interface might look and may vary from the production app.'
    ]
  }
];

export function GuideProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSearchOpen, closeReviewModal } = useApp();

  // Guide Mode toggle state (defaults to true on desktop)
  const [isGuideMode, setIsGuideMode] = useState(() => {
    try {
      const saved = localStorage.getItem('myntra_walkthrough_mode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Sync isGuideMode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('myntra_walkthrough_mode', JSON.stringify(isGuideMode));
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

  const toggleGuideMode = useCallback(() => {
    setIsGuideMode((prev) => !prev);
  }, []);

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
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
}
