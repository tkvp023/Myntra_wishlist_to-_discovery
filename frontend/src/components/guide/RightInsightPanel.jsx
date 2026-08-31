import React from 'react';
import { useGuide } from '../../context/GuideContext';
import { Check, BookOpen, Info, CheckCircle2, ExternalLink } from 'lucide-react';

export default function RightInsightPanel() {
  const { currentStep } = useGuide();

  return (
    <aside className="w-80 xl:w-[380px] 2xl:w-[410px] flex flex-col gap-2.5 z-30 select-none max-h-full overflow-y-auto no-scrollbar py-0.5">
      {/* 1. Research & Design Architecture Card */}
      <div className="bg-[#161922] border border-slate-700/70 rounded-xl p-4 xl:p-5 shadow-lg text-white">
        {/* Metric Pill */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
            {currentStep.researchMetric}
          </span>
          <span className="text-xs font-medium text-slate-400">Customer Insights</span>
        </div>

        {/* Section Heading */}
        <h3 className="text-sm xl:text-base font-bold text-slate-100 leading-snug">
          {currentStep.researchHeading}
        </h3>

        {/* Rationale Callout Box */}
        <div className="bg-[#0F1117] border border-slate-800 rounded-lg p-3 my-2.5 space-y-2">
          <p className="text-xs xl:text-[13px] text-slate-300 leading-relaxed font-normal">
            {currentStep.researchQuote}
          </p>

          {currentStep.dataSource && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-medium">Source:</span>
              <a
                href={currentStep.dataSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF3F6C] hover:text-[#FF6B8B] font-semibold underline underline-offset-2 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{currentStep.dataSource.label}</span>
                <ExternalLink className="w-3 h-3 inline-block stroke-[2.5]" />
              </a>
            </div>
          )}
        </div>

        {/* Key Features & Functionality */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Key Features & Functionality
          </h4>

          <ul className="space-y-1.5">
            {currentStep.keyPoints.map((pt, i) => (
              <li key={i} className="text-xs xl:text-[12.5px] text-slate-300 flex items-start gap-2 leading-relaxed">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. Visual Fidelity Note */}
      <div className="bg-[#161922] border border-slate-700/70 rounded-xl p-3 xl:p-3.5 text-slate-400 text-xs leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-200">Interactive Demo:</strong> Built to match Myntra's real app experience so you can easily test each feature.
        </p>
      </div>
    </aside>
  );
}
