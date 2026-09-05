import React, { useState } from 'react';
import { useGuide } from '../../context/GuideContext';
import { Compass, Smartphone, Sparkles, ArrowUpRight, X } from 'lucide-react';

export default function GuideTopBar() {
  const {
    isGuideMode,
    toggleGuideMode,
    currentStepIndex,
    totalSteps
  } = useGuide();

  const [hintDismissed, setHintDismissed] = useState(false);

  return (
    <header className="w-full max-w-[1680px] mx-auto px-2 sm:px-6 xl:px-10 py-1.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 z-40 relative select-none">
      {/* 1. App Title & Project Badge */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-[#121520]/90 backdrop-blur-md border border-slate-700/70 px-3 py-1.5 rounded-lg shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3F6C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3F6C]"></span>
          </span>
          <span className="text-xs font-black text-slate-100 tracking-wide uppercase">
            Myntra Trust-Tags MVP
          </span>
          <span className="text-[11px] font-medium text-slate-400 border-l border-slate-700/80 pl-2 hidden xs:inline">
            Interactive Prototype
          </span>
        </div>
      </div>

      {/* 2. Prominent High-Contrast Mode Switcher & Floating Callout */}
      <div className="relative flex items-center">
        {/* Glow Frame Switcher Container */}
        <div className="bg-[#10131E] p-1 rounded-xl border-2 border-[#FF3F6C]/40 shadow-[0_0_22px_rgba(255,63,108,0.28)] flex items-center gap-1">
          {/* Tab 1: Walkthrough Mode */}
          <button
            type="button"
            onClick={() => !isGuideMode && toggleGuideMode(true)}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              isGuideMode
                ? 'bg-gradient-to-r from-[#FF3F6C] to-[#E72744] text-white shadow-md shadow-[#FF3F6C]/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
            title="Switch to Walkthrough Mode (Guided Tour)"
          >
            <Compass className={`w-3.5 h-3.5 ${isGuideMode ? 'animate-spin-slow' : ''}`} />
            <span>Walkthrough Mode</span>
            {isGuideMode && (
              <span className="hidden sm:inline-block bg-white/20 text-white text-[9.5px] px-1.5 py-0.2 rounded font-extrabold ml-0.5">
                {currentStepIndex + 1}/{totalSteps}
              </span>
            )}
          </button>

          {/* Tab 2: Normal App Mode */}
          <button
            type="button"
            onClick={() => isGuideMode && toggleGuideMode(false)}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              !isGuideMode
                ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Switch to Normal App View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Normal App View</span>
          </button>
        </div>

        {/* 3. Floating Callout / Hint Message near the Toggle Button */}
        {!hintDismissed && (
          <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
            {/* Triangular Arrow Pointer pointing to the target button */}
            <div
              className={`w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] absolute -top-[6px] transition-all ${
                isGuideMode
                  ? 'border-b-[#FF3F6C] right-8 sm:right-12'
                  : 'border-b-[#10B981] right-36 sm:right-44'
              }`}
            />

            <div className="bg-[#121522]/98 backdrop-blur-md border border-[#FF3F6C]/70 text-white px-3 py-1.5 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_12px_rgba(255,63,108,0.25)] flex items-center gap-2 whitespace-nowrap">
              {isGuideMode ? (
                <>
                  <span className="flex h-2 w-2 relative flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3F6C] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3F6C]"></span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-100">
                    <span>Toggle to check out <strong className="text-[#FF3F6C]">Normal Mode</strong></span>
                    <ArrowUpRight className="w-3 h-3 text-[#FF3F6C]" />
                  </div>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-100">
                    <span>Toggle to return to <strong className="text-emerald-400">Walkthrough Mode</strong></span>
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setHintDismissed(true);
                }}
                className="text-slate-400 hover:text-white p-0.5 ml-1 rounded hover:bg-slate-800 text-[10px] cursor-pointer"
                title="Dismiss hint"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

