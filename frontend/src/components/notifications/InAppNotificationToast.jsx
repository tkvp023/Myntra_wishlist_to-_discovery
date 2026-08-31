import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, ArrowRight, ShieldCheck, Sparkles, Tag, Clock, Repeat } from 'lucide-react';
import { getProductImageUrl } from '../../utils/imageHelper';
import { useGuide } from '../../context/GuideContext';

export default function InAppNotificationToast({ wishlistItems = [] }) {
  const navigate = useNavigate();
  const { isGuideMode, currentStepIndex } = useGuide();
  const [visible, setVisible] = useState(false);
  const [notifTypeIndex, setNotifTypeIndex] = useState(0); // 0: Trust Milestone, 1: Price Drop, 2: Low Stock Reminder

  // If in guide mode, notification is strictly ONLY visible on Step 1 (index 0); removed on Step 2+
  useEffect(() => {
    if (isGuideMode) {
      setVisible(currentStepIndex === 0);
    }
  }, [isGuideMode, currentStepIndex]);

  // Ambient trigger only in normal mode
  useEffect(() => {
    if (!isGuideMode) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isGuideMode]);

  // In Walkthrough Mode, strictly render ONLY on Step 1 (currentStepIndex === 0)
  if (isGuideMode && currentStepIndex !== 0) return null;
  if (!visible) return null;

  const candidate = wishlistItems.find(
    (item) => item.reengagement?.hasData && item.reengagement?.message
  ) || wishlistItems[0] || {
    product: {
      id: 'prod_1',
      name: 'Men Pure Cotton Casual Shirt',
      brand: 'ROADSTER',
      finalPrice: 649,
      mrp: 1699,
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'],
      category: 'clothing'
    },
    reengagement: {
      message: '93% of verified buyers confirm this feels genuine',
      deepLinkFilter: 'authenticity'
    }
  };

  const product = candidate.product;
  const image = getProductImageUrl(product?.images?.[0], product?.category, 1);

  // 3 Alternating Notification Modes (Simulating real-world Myntra Notification Architecture)
  const NOTIFICATION_TYPES = [
    {
      id: 'trust_milestone',
      tag: '✨ Wishlist Trust Milestone',
      tagColor: 'text-[#FF3F6C] bg-[#FFF0F3] border-[#FF3F6C]/30',
      title: `${product.brand} • ${product.name}`,
      message: candidate.reengagement?.message || '93% of verified buyers confirm this feels genuine',
      ctaText: 'View Product',
      route: `/product/${product.id}`
    },
    {
      id: 'price_drop',
      tag: '🏷️ Price Drop Alert',
      tagColor: 'text-[#047857] bg-[#E6F9F5] border-[#03A685]/30',
      title: `${product.brand} • Price Slashed!`,
      message: `Price dropped to ₹${product.finalPrice} (Save ₹${(product.mrp || 1699) - product.finalPrice})`,
      ctaText: 'Buy at Lowest Price',
      route: `/product/${product.id}`
    },
    {
      id: 'stock_reminder',
      tag: '⚡ Wishlist Sale Reminder',
      tagColor: 'text-[#B45309] bg-[#FFFBEB] border-[#F59E0B]/30',
      title: `${product.brand} • Selling Fast`,
      message: 'Only 2 items left in size 39 in your saved items',
      ctaText: 'Claim Before Sold Out',
      route: `/wishlist`
    }
  ];

  const currentNotif = NOTIFICATION_TYPES[notifTypeIndex];

  const handleClick = () => {
    setVisible(false);
    navigate(currentNotif.route);
  };

  const handleNextType = (e) => {
    e.stopPropagation();
    setNotifTypeIndex((prev) => (prev + 1) % NOTIFICATION_TYPES.length);
  };

  return (
    <div
      id="in-app-notification-banner"
      className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[400px] animate-in slide-in-from-top duration-300 select-none"
    >
      <div className="bg-white/98 backdrop-blur-md border border-[#EAEAEC] shadow-2xl rounded-2xl p-3 flex flex-col gap-2 relative ring-1 ring-black/5">
        
        {/* OS Mobile Push Header */}
        <div className="flex items-center justify-between border-b border-[#F5F5F6] pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gradient-to-tr from-[#FF3F6C] to-[#FF905A] flex items-center justify-center text-white text-[9px] font-black shadow-2xs">
              M
            </div>
            <span className="text-[10px] font-bold text-[#282C3F] tracking-wide uppercase">MYNTRA</span>
            <span className="text-[9px] text-[#94969F]">• Push Notification • now</span>
          </div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss notification"
            className="p-0.5 rounded-full text-[#94969F] hover:text-[#282C3F] hover:bg-[#F5F5F6] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body */}
        <div
          onClick={handleClick}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Thumbnail */}
          <img
            src={image}
            alt={product.name}
            className="w-12 h-14 object-cover object-top rounded-lg border border-[#EAEAEC] flex-shrink-0 group-hover:scale-[1.02] transition-transform"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${currentNotif.tagColor}`}>
                {currentNotif.tag}
              </span>
            </div>

            <h4 className="text-[11px] font-bold text-[#282C3F] truncate">
              {currentNotif.title}
            </h4>

            <p className="text-[10px] text-[#535766] truncate mt-0.5 font-medium">
              {currentNotif.message}
            </p>

            <span className="text-[10px] font-bold text-[#FF3F6C] group-hover:underline inline-flex items-center gap-0.5 mt-0.5">
              <span>{currentNotif.ctaText}</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
