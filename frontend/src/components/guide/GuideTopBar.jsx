import React from 'react';
import { useGuide } from '../../context/GuideContext';
import { Compass, Smartphone, Layers } from 'lucide-react';

export default function GuideTopBar() {
  const {
    isGuideMode,
    toggleGuideMode
  } = useGuide();

  return (
    <header className="w-full max-w-[1680px] mx-auto px-2 sm:px-6 xl:px-10 py-1.5 flex items-center justify-between gap-3 z-40 relative select-none">
      {/* 1. App Title & Project Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 bg-[#161922] border border-slate-700/60 px-3.5 py-1.5 rounded-lg shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#FF3F6C]"></div>
          <span className="text-xs font-bold text-slate-100 tracking-wide uppercase">
            Myntra Trust MVP
          </span>
          <span className="text-[11px] font-medium text-slate-400 border-l border-slate-700 pl-2">
            Interactive Prototype
          </span>
        </div>
      </div>

      {/* 2. Professional Segmented Mode Switcher */}
      <div className="flex items-center gap-2">
        <div className="bg-[#161922] p-1 rounded-lg border border-slate-700/60 flex items-center gap-1 shadow-sm">
          {/* Tab 1: Walkthrough Mode */}
          <button
            type="button"
            onClick={() => !isGuideMode && toggleGuideMode()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              isGuideMode
                ? 'bg-[#FF3F6C] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Switch to Walkthrough Mode (Guided Tour)"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Walkthrough Mode</span>
          </button>

          {/* Tab 2: Normal App Mode */}
          <button
            type="button"
            onClick={() => isGuideMode && toggleGuideMode()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              !isGuideMode
                ? 'bg-slate-100 text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Switch to Normal App View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Normal App View</span>
          </button>
        </div>
      </div>
    </header>
  );
}
