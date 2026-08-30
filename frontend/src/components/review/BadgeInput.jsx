import React from 'react';
import {
  ShieldCheck,
  Ruler,
  Camera,
  Layers,
  Footprints,
  ShoppingBag,
  Gem,
  Palette,
  Heart,
  Check
} from 'lucide-react';

const ICON_MAP = {
  ShieldCheck,
  Ruler,
  Camera,
  Layers,
  Footprints,
  ShoppingBag,
  Gem,
  Palette,
  Heart
};

export default function BadgeInput({ badgeConfig, value, onChange }) {
  const { label, question, states, icon } = badgeConfig;
  const IconComponent = ICON_MAP[icon] || ShieldCheck;

  // Filter actionable states (exclude null/skip)
  const selectableStates = states.filter((s) => s.value !== null);

  return (
    <div className="bg-[#F9F9FB] border border-[#EAEAEC] rounded-xl p-3 space-y-2">
      {/* Category Header with Icon & Question */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black text-[#282C3F]">
            <IconComponent className="w-4 h-4 text-[#FF3F6C] flex-shrink-0" />
            <span>{label}</span>
          </div>
          {question && (
            <p className="text-[11px] text-[#535766] mt-0.5 font-medium leading-snug">
              {question}
            </p>
          )}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[10px] text-[#94969F] hover:text-[#FF3F6C] font-semibold cursor-pointer underline flex-shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* All Options Clearly Displayed as Accessible Choice Buttons */}
      <div className="grid grid-cols-1 gap-1.5 pt-0.5">
        {selectableStates.map((state) => {
          const isSelected = value === state.value;
          const isPositive = state.type === 'positive';
          const isNeutral = state.type === 'neutral';
          const isNegative = state.type === 'negative';

          return (
            <button
              key={state.value}
              type="button"
              onClick={() => onChange(isSelected ? null : state.value)}
              aria-pressed={isSelected}
              className={`min-h-[40px] px-3 py-2 rounded-lg border text-xs font-bold text-left flex items-center justify-between gap-2 transition-all cursor-pointer select-none ${
                isSelected
                  ? isPositive
                    ? 'border-[#03A685] bg-[#E6F9F5] text-[#047857] shadow-xs ring-1 ring-[#03A685]'
                    : isNeutral
                    ? 'border-[#F5A623] bg-[#FFF8E7] text-[#D4880F] shadow-xs ring-1 ring-[#F5A623]'
                    : 'border-[#D5284F] bg-[#FEF0EF] text-[#D5284F] shadow-xs ring-1 ring-[#D5284F]'
                  : 'border-[#D4D5D9] bg-white text-[#535766] hover:border-[#282C3F] hover:bg-[#F5F5F6]'
              }`}
            >
              <span className="flex items-center gap-2 truncate leading-tight">
                {isPositive && <span className="w-2 h-2 rounded-full bg-[#03A685] flex-shrink-0"></span>}
                {isNeutral && <span className="w-2 h-2 rounded-full bg-[#F5A623] flex-shrink-0"></span>}
                {isNegative && <span className="w-2 h-2 rounded-full bg-[#D5284F] flex-shrink-0"></span>}
                <span className="truncate">{state.label}</span>
              </span>

              {isSelected ? (
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                    isPositive ? 'bg-[#03A685]' : isNeutral ? 'bg-[#F5A623]' : 'bg-[#D5284F]'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-[#D4D5D9] flex-shrink-0"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
