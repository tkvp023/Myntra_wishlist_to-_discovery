import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ShieldCheck, ArrowRight, Bell, Tag, Heart, Clock } from 'lucide-react';
import { getProductImageUrl } from '../../utils/imageHelper';

export default function NotificationDrawer({ isOpen, onClose, wishlistItems = [] }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'wishlist' | 'product'

  if (!isOpen) return null;

  // Build Two-Notification-Type System per Section 8 & 9:
  // Type 1: Wishlist-Bound Stalled Intent Alert (Crossed 50 threshold while wishlisted)
  // Type 2: Direct Product Quality / Decision Alert (Single strongest positive stat)
  // Staggering gap: 2 hours (120 mins)
  // Priority: Price drop notifications simulated first
  const notifications = wishlistItems
    .filter((item) => item.reengagement?.hasData && item.reengagement?.message)
    .map((item, index) => {
      const topBadge = item.reengagement.badgeHighlights?.[0];
      const deepLink = item.reengagement.deepLinkFilter || 'authenticity';
      const isWishlistType = index % 2 === 0;

      return {
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        image: getProductImageUrl(item.product.images?.[0], item.product.category, 1),
        daysStalled: item.daysStalled || 2,
        type: isWishlistType ? 'wishlist' : 'product',
        typeLabel: isWishlistType ? 'Wishlist Milestone' : 'Trust Confirmation',
        timestamp: `${(index + 1) * 2}h ago`, // 2-hour staggering gap
        title: isWishlistType
          ? `Wishlist Update: ${item.product.brand}`
          : `Verified Signal: ${item.product.brand}`,
        message: topBadge && !topBadge.belowThreshold
          ? `${topBadge.percent}% of verified buyers confirm this item ${topBadge.label.toLowerCase()}.`
          : `More and more buyers are noticing this item and early feedback is positive.`,
        stat: topBadge && !topBadge.belowThreshold
          ? `${topBadge.percent}% ${topBadge.label}`
          : `🔥 Trending: More buyers noticing this`,
        deepLinkUrl: `/product/${item.product.id}?filter=${deepLink}`
      };
    });

  // Simulated high-priority Price Drop notification (Priority rule: price send takes priority on same day)
  const priceNotification = {
    id: 'notif_price_1',
    productId: 'prod_1',
    type: 'price',
    typeLabel: 'Price Drop Alert',
    timestamp: '30m ago',
    title: 'Price Drop: Roadster Men Shirt',
    message: 'Now ₹649 (62% OFF). Plus 93% of verified buyers confirm it feels genuine.',
    stat: '62% OFF + 93% Genuine',
    deepLinkUrl: '/product/prod_1',
    image: getProductImageUrl('/images/product-1-a.jpg', 'clothing', 1)
  };

  const allNotifications = [priceNotification, ...notifications];

  const filteredNotifs = allNotifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'wishlist') return n.type === 'wishlist';
    if (activeTab === 'product') return n.type === 'product' || n.type === 'price';
    return true;
  });

  const handleNotificationClick = (url) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-[#EAEAEC] bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#FF3F6C] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-extrabold text-[#282C3F] uppercase tracking-wider">
                  Notifications
                </h2>
                <p className="text-[10px] text-[#535766]">
                  Two-Notification System (Section 8 & 9)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-full text-[#535766] hover:bg-[#F5F5F6] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#F5F5F6] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-[#FF3F6C] shadow-2xs' : 'text-[#535766]'
              }`}
            >
              All ({allNotifications.length})
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex-1 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                activeTab === 'wishlist' ? 'bg-white text-[#FF3F6C] shadow-2xs' : 'text-[#535766]'
              }`}
            >
              Wishlist
            </button>
            <button
              onClick={() => setActiveTab('product')}
              className={`flex-1 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                activeTab === 'product' ? 'bg-white text-[#FF3F6C] shadow-2xs' : 'text-[#535766]'
              }`}
            >
              Trust Signals
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center text-[#94969F] px-4">
              <Bell className="w-10 h-10 mx-auto text-[#D4D5D9] mb-2" />
              <p className="text-xs font-bold text-[#535766]">No notifications in this tab</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.deepLinkUrl)}
                className={`group cursor-pointer border rounded-xl p-3 transition-all active:scale-[0.99] shadow-2xs ${
                  notif.type === 'price'
                    ? 'bg-[#FFF8F0] border-[#FF905A]/30 hover:bg-[#FFF2E5]'
                    : notif.type === 'wishlist'
                    ? 'bg-[#FFF0F3]/35 border-[#FF3F6C]/25 hover:bg-[#FFF0F3]/70'
                    : 'bg-[#F0FDF9] border-[#14958F]/25 hover:bg-[#E6FAF4]'
                }`}
              >
                {/* Header Tag + Staggered Timestamp */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                      notif.type === 'price'
                        ? 'text-[#FF905A]'
                        : notif.type === 'wishlist'
                        ? 'text-[#FF3F6C]'
                        : 'text-[#14958F]'
                    }`}
                  >
                    {notif.type === 'price' ? <Tag className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {notif.typeLabel}
                  </span>
                  <span className="text-[9px] text-[#94969F] font-semibold flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {notif.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <img
                    src={notif.image}
                    alt={notif.title}
                    className="w-12 h-14 object-cover object-top rounded-md border border-[#EAEAEC] flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-[#282C3F] truncate">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-[#535766] leading-snug mt-0.5">
                      {notif.message}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#14958F] bg-white px-1.5 py-0.5 rounded border border-[#EAEAEC]">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        {notif.stat}
                      </span>

                      <span className="text-[10px] font-bold text-[#FF3F6C] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>{notif.type === 'wishlist' ? 'View Wishlist' : 'See Reviews'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="p-2.5 bg-[#F5F5F6] border-t border-[#EAEAEC] text-[9px] text-[#94969F] text-center space-y-0.5">
          <p>Section 9 Rules: Aggregate-only • 2hr staggering gap • Price-priority</p>
        </div>
      </div>
    </div>
  );
}
