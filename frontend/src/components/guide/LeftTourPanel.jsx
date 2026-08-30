import React from 'react';
import { useGuide } from '../../context/GuideContext';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Bell,
  Home,
  Search,
  Heart,
  Shirt,
  Filter,
  MousePointerClick,
  Check,
  Star
} from 'lucide-react';

export default function LeftTourPanel() {
  const {
    currentStepIndex,
    totalSteps,
    currentStep,
    nextStep,
    prevStep,
    goToStep
  } = useGuide();

  const QUICK_JUMPS = [
    { label: 'Push Notification', step: 0, icon: Bell, route: '/' },
    { label: 'Homepage Shelf', step: 1, icon: Home, route: '/' },
    { label: 'Search Tile Markers', step: 2, icon: Search, route: '/' },
    { label: 'Wishlist & Tags', step: 3, icon: Heart, route: '/wishlist' },
    { label: 'PDP Trust Dashboard', step: 4, icon: Shirt, route: '/product/prod_1' },
    { label: 'Review Badge Filters', step: 5, icon: Filter, route: '/product/prod_1' },
    { label: 'Review Submission', step: 6, icon: Star, route: '/profile' }
  ];

  return (
    <aside className="w-80 xl:w-[380px] 2xl:w-[410px] flex flex-col gap-2.5 z-30 select-none max-h-full overflow-y-auto no-scrollbar py-0.5">
      {/* 1. Primary Tour Step Card */}
      <div className="bg-[#161922] border border-slate-700/70 rounded-xl p-4 xl:p-5 shadow-lg text-white flex flex-col justify-between">
        <div>
          {/* Header & Step Counter */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF3F6C] bg-[#FF3F6C]/10 border border-[#FF3F6C]/30 px-2 py-0.5 rounded">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
            <span className="text-xs font-semibold text-slate-400">{currentStep.badgeText}</span>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-sm xl:text-base font-bold text-slate-100 leading-snug">
            {currentStep.title}
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5 leading-normal">
            {currentStep.subtitle}
          </p>

          {/* Description */}
          <div className="bg-[#0F1117] border border-slate-800 rounded-lg p-3 my-2.5">
            <p className="text-xs xl:text-[13px] text-slate-300 leading-relaxed font-normal">
              {currentStep.description}
            </p>
          </div>

          {/* Action Prompt Box */}
          <div className="bg-[#1E2330] border border-slate-700/80 rounded-lg p-2.5 xl:p-3 mb-2.5 flex items-start gap-2.5">
            <MousePointerClick className="w-4 h-4 text-[#FF3F6C] flex-shrink-0 mt-0.5" />
            <p className="text-xs xl:text-[12.5px] font-semibold text-slate-200 leading-snug">
              {currentStep.actionPrompt}
            </p>
          </div>
        </div>

        {/* Next / Prev Navigation Controls */}
        <div className="flex items-center gap-2 pt-2.5 border-t border-slate-800">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={nextStep}
            className="flex-1 py-2 px-3 rounded-lg bg-[#FF3F6C] hover:bg-[#E0355E] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Restart Tour' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Quick Screen Direct Jumps */}
      <div className="bg-[#161922] border border-slate-700/70 rounded-xl p-3 xl:p-3.5 shadow-lg text-white">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          <span>Screen Navigator</span>
        </h4>

        <div className="grid grid-cols-2 gap-1.5">
          {QUICK_JUMPS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = currentStepIndex === item.step;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goToStep(item.step)}
                className={`py-1.5 px-2.5 rounded-md text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer truncate ${
                  isActive
                    ? 'bg-[#FF3F6C] text-white font-bold'
                    : 'bg-[#0F1117] hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <Check className="w-3 h-3 stroke-[2.5] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
