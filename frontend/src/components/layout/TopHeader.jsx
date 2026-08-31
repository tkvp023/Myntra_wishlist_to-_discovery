import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Mic, Camera, Bell, Heart, ShoppingBag, ArrowLeft, User, MapPin, ChevronDown, Banknote } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchOverlay from '../search/SearchOverlay';
import NotificationDrawer from '../notifications/NotificationDrawer';

export default function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist, wishlistCount, bagCount, isSearchOpen, setIsSearchOpen } = useApp();

  const isHome = location.pathname === '/';
  const isPDP = location.pathname.startsWith('/product');
  const isWishlist = location.pathname === '/wishlist';
  const isBag = location.pathname === '/bag';
  const hideHeader = isWishlist || isBag;

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const placeholders = ['"Tops"', '"Shirts"', '"Kurta Sets"', '"Shoes"', '"Jeans"', '"Dresses"'];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const hasNotifications = wishlist.some(
    (item) => item.reengagement?.hasData && item.reengagement?.message
  );

  return (
    <>
      {!hideHeader && (
        <header className="sticky top-0 z-40 bg-white border-b border-[#EAEAEC] select-none flex flex-col shadow-2xs">
        
        {/* 1. TOP ADDRESS BAR & MYNTRA CASH ROW (Home only) */}
        {isHome ? (
          <div className="px-3 pt-2 pb-1 flex items-center justify-between bg-white text-[#282C3F]">
            {/* Delivery Address Dropdown */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-[#282C3F] flex-shrink-0 fill-[#282C3F]" />
              <span className="text-[11px] font-extrabold text-[#282C3F] truncate">
                Deliver to <strong className="font-black">Prestige Towers</strong> - 4th Block, Koramangala...
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#535766] flex-shrink-0 ml-0.5" />
            </div>

            {/* Myntra Cash Pill (₹12 💵) */}
            <div className="flex items-center gap-1 bg-[#F5F5F6] border border-[#EAEAEC] px-2 py-0.5 rounded-full text-[11px] font-black text-[#282C3F] flex-shrink-0 ml-2 shadow-2xs">
              <span>₹12</span>
              <span className="text-xs">💵</span>
            </div>
          </div>
        ) : null}

        {/* 2. SEARCH BAR & ACTION ICONS ROW (Matching Screenshot) */}
        <div className="px-3 py-2 flex items-center justify-between gap-2.5">
          {/* Back button if not on Home */}
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Go Back"
              className="p-1 -ml-1 text-[#282C3F] hover:text-[#FF3F6C] transition-colors rounded-full cursor-pointer flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Search Bar with Myntra M Logo, Placeholder, and Search Icon */}
          <div
            id="top-search-bar"
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 flex items-center bg-white border border-[#D4D5D9] hover:border-[#FF3F6C] rounded-full px-3 py-1.5 shadow-2xs transition-all cursor-pointer min-w-0"
          >
            {/* Myntra Logo Icon inside Search Bar */}
            <div className="flex items-center pr-2 border-r border-[#EAEAEC] flex-shrink-0">
              <svg className="w-4 h-3.5" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 70L32 10L50 50L30 70H12Z" fill="#FF3F6C" />
                <path d="M50 50L68 10L88 70H70L50 50Z" fill="#F05524" />
                <path d="M30 70L50 30L70 70H30Z" fill="#FD913C" />
              </svg>
            </div>

            <span className="text-xs text-[#535766] px-2 flex-1 truncate font-medium">
              {isPDP ? 'Search in myntra' : placeholders[placeholderIndex]}
            </span>

            {/* Right Search / Camera Icons */}
            <div className="flex items-center space-x-2 text-[#535766] flex-shrink-0">
              <Search className="w-4 h-4 hover:text-[#FF3F6C] transition-colors" />
            </div>
          </div>

          {/* Right Action Icons: PDP shows Heart + Bag; Home shows Bell + Heart + Bag + Profile */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            {/* Notification Bell (on non-PDP) */}
            {!isPDP && (
              <button
                onClick={() => setIsNotificationOpen(true)}
                aria-label="Notifications"
                className="relative p-1 text-[#282C3F] hover:text-[#FF3F6C] transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {hasNotifications && (
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-[#FF3F6C] rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>
            )}

            {/* Wishlist Heart */}
            <button
              onClick={() => navigate('/wishlist')}
              aria-label="Wishlist"
              className="relative p-1 text-[#282C3F] hover:text-[#FF3F6C] transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF3F6C] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={() => navigate('/bag')}
              aria-label="Shopping Bag"
              className="relative p-1 text-[#282C3F] hover:text-[#FF3F6C] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {bagCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF3F6C] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
                  {bagCount}
                </span>
              )}
            </button>

            {/* Profile Avatar (on non-PDP) */}
            {!isPDP && (
              <button
                onClick={() => navigate('/profile')}
                aria-label="Profile"
                className="p-1 text-[#282C3F] hover:text-[#FF3F6C] transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>
      )}

      {/* Section 8 Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Section 8/9 Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        wishlistItems={wishlist}
      />
    </>
  );
}
