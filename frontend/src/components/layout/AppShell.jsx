import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopHeader from './TopHeader';
import BottomNav from './BottomNav';
import InAppNotificationToast from '../notifications/InAppNotificationToast';
import GuideTopBar from '../guide/GuideTopBar';
import LeftTourPanel from '../guide/LeftTourPanel';
import RightInsightPanel from '../guide/RightInsightPanel';
import { useApp } from '../../context/AppContext';
import { useGuide } from '../../context/GuideContext';
import { Wifi, Battery, Signal } from 'lucide-react';

import ErrorBoundary from './ErrorBoundary';
import ReviewModal from '../review/ReviewModal';

export default function AppShell() {
  const { toastMessage, wishlist, reviewModalProduct, closeReviewModal, showToast } = useApp();
  const { isGuideMode } = useGuide();
  const location = useLocation();
  const isPDP = location.pathname.startsWith('/product');

  // Automatically dismiss review modal overlay whenever route changes
  useEffect(() => {
    if (closeReviewModal) {
      closeReviewModal();
    }
  }, [location.pathname, closeReviewModal]);

  return (
    <div className="app-frame-wrapper h-screen max-h-screen overflow-hidden flex flex-col p-1 sm:px-4 sm:pt-0.5 sm:pb-0.5">
      
      {/* 1. Global Guide Top Navigation Bar */}
      <div className="flex-shrink-0">
        <GuideTopBar />
      </div>

      {/* 2. Main Center Canvas: Left Wing + Center Phone + Right Wing */}
      <div className="w-full max-w-[1680px] mx-auto px-2 sm:px-6 xl:px-10 flex items-center justify-center gap-4 xl:gap-8 2xl:gap-12 flex-1 min-h-0 relative z-10 overflow-hidden my-auto py-0.5">
        
        {/* Left Wing: Tour Navigator & Quick Screen Jumps (Only visible when Guide Mode is ON) */}
        {isGuideMode && (
          <div className="hidden lg:flex items-center justify-center h-full max-h-[calc(100vh-58px)] animate-in fade-in slide-in-from-left-4 duration-300">
            <LeftTourPanel />
          </div>
        )}

        {/* Center Mobile Prototype Container */}
        <div className="mobile-phone-container flex-shrink-0 transition-all duration-300">
          
          {/* A. Realistic Mobile Status Bar */}
          <div className="hidden sm:flex items-center justify-between px-6 pt-2 pb-1 bg-white text-[#282C3F] select-none text-[11px] font-bold z-50 border-b border-[#F5F5F6]/60">
            <span>9:41</span>
            
            {/* Dynamic Island / Speaker Pill Mock */}
            <div className="w-20 h-4 bg-[#1E2235] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#2D334D] mr-2"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#14958F]/70"></div>
            </div>

            <div className="flex items-center gap-1.5 text-[#282C3F]">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 fill-[#282C3F]" />
            </div>
          </div>

          {/* B. Sticky App Header (With Search & Notification Bell) */}
          <TopHeader />

          {/* C. Ambient In-App Notification Push Alert (Section 8/9) */}
          <InAppNotificationToast wishlistItems={wishlist} />

          {/* D. Scrollable Page Body with ErrorBoundary */}
          <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-white">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>

          {/* E. Full-Screen Review Submission Modal (Mounted at phone root level) */}
          {reviewModalProduct && (
            <ReviewModal
              product={reviewModalProduct}
              isOpen={true}
              onClose={closeReviewModal}
              onReviewSubmitted={() => {
                showToast('Trust badges & verified review published to community dashboard!');
                closeReviewModal();
              }}
            />
          )}

          {/* F. Global Toast Alert */}
          {toastMessage && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 bg-[#282C3F] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-fade-in flex items-center gap-2 pointer-events-none whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#14958F]"></span>
              {toastMessage}
            </div>
          )}

          {/* G. Persistent Bottom Navigation Bar */}
          {!isPDP && <BottomNav />}

          {/* H. Bottom Home Indicator Bar */}
          <div className="hidden sm:flex justify-center pb-1.5 pt-0.5 bg-white select-none">
            <div className="w-28 h-1 bg-[#D4D5D9] rounded-full"></div>
          </div>
        </div>

        {/* Right Wing: Live Research Insights & Threshold Guardrails (Only visible when Guide Mode is ON) */}
        {isGuideMode && (
          <div className="hidden lg:flex items-center justify-center h-full max-h-[calc(100vh-58px)] animate-in fade-in slide-in-from-right-4 duration-300">
            <RightInsightPanel />
          </div>
        )}
      </div>

      {/* 3. Global Prototype Disclaimer Footer */}
      <footer className="text-center text-[10px] text-white/50 py-0.5 px-4 max-w-4xl mx-auto select-none flex-shrink-0">
        <p className="leading-tight truncate sm:whitespace-normal">
          <strong className="text-white/80">Disclaimer:</strong> Replicates native Myntra mobile shopping UX for concept evaluation. Minor visual differences may exist compared to production.
        </p>
      </footer>
    </div>
  );
}
