import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const { wishlistCount, bagCount } = useApp();
  const navigate = useNavigate();

  return (
    <nav className="sticky bottom-0 z-40 bg-white border-t border-[#EAEAEC] h-14 flex items-center justify-around px-1 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] select-none">
      
      {/* 1. HOME TAB (Myntra Stylized 'M' Icon) */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 h-full py-1 transition-all relative ${
            isActive ? 'text-[#FF3F6C]' : 'text-[#535766]'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <div className="absolute top-0 left-4 right-4 h-0.5 bg-[#FF3F6C] rounded-b-full"></div>
            )}
            <div className="h-5 flex items-center justify-center mb-0.5">
              <svg className="w-5 h-4" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 70L32 10L50 50L30 70H12Z" fill={isActive ? '#FF3F6C' : '#535766'} />
                <path d="M50 50L68 10L88 70H70L50 50Z" fill={isActive ? '#F05524' : '#8B8D97'} />
                <path d="M30 70L50 30L70 70H30Z" fill={isActive ? '#FD913C' : '#535766'} />
              </svg>
            </div>
            <span className={`text-[10px] ${isActive ? 'font-black text-[#FF3F6C]' : 'font-semibold text-[#535766]'}`}>
              Home
            </span>
          </>
        )}
      </NavLink>

      {/* 2. FWD TAB (Under ₹999 — Gen-Z Trends) */}
      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            isActive ? 'text-[#FF3F6C]' : 'text-[#282C3F]'
          }`
        }
      >
        <div className="h-5 flex items-center justify-center mb-0.5">
          <span className="font-black text-xs tracking-tighter lowercase italic">fwd</span>
        </div>
        <span className="text-[9px] font-bold text-[#535766] leading-none">
          Under ₹999
        </span>
      </NavLink>

      {/* 3. M-NOW TAB (From 30 min — Express Delivery) */}
      <div
        onClick={() => navigate('/')}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer group"
      >
        <div className="h-5 flex items-center justify-center mb-0.5">
          <span className="font-extrabold text-[11px] tracking-tight lowercase flex items-center gap-0.5 text-[#282C3F] group-hover:text-[#FF3F6C]">
            <span className="italic font-black text-xs">m</span>·now
          </span>
        </div>
        <span className="text-[9px] font-bold text-[#535766] leading-none">
          From 30 min
        </span>
      </div>

      {/* 4. LUXE TAB (Luxury) */}
      <div
        onClick={() => navigate('/categories')}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer group"
      >
        <div className="h-5 flex items-center justify-center mb-0.5">
          <span className="font-serif font-bold text-xs tracking-widest uppercase text-[#282C3F] group-hover:text-[#FF3F6C]">
            LUXE
          </span>
        </div>
        <span className="text-[9px] font-bold text-[#535766] leading-none">
          Luxury
        </span>
      </div>

      {/* 5. BAG TAB (Shopping Bag with Dynamic Badge Count) */}
      <NavLink
        to="/bag"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 h-full py-1 transition-all relative ${
            isActive ? 'text-[#FF3F6C]' : 'text-[#282C3F]'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <div className="absolute top-0 left-4 right-4 h-0.5 bg-[#FF3F6C] rounded-b-full"></div>
            )}
            <div className="h-5 flex items-center justify-center mb-0.5 relative">
              <ShoppingBag className={`w-4 h-4 ${isActive ? 'text-[#FF3F6C]' : 'text-[#282C3F]'}`} />
              {bagCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#FF3F6C] text-white text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white">
                  {bagCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] ${isActive ? 'font-black text-[#FF3F6C]' : 'font-semibold text-[#535766]'}`}>
              Bag
            </span>
          </>
        )}
      </NavLink>
    </nav>
  );
}
