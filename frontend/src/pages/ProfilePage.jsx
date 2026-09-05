import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  Star,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Truck,
  RotateCcw,
  CheckCircle2,
  Award,
  Sparkles,
  ThumbsUp,
  CreditCard,
  MapPin,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useGuide } from '../context/GuideContext';
import { getProductImageUrl } from '../utils/imageHelper';

export default function ProfilePage() {
  const { wishlistCount, showToast, openReviewModal } = useApp();
  const guideContext = useGuide();
  const navigate = useNavigate();

  const isStep7 = guideContext?.isGuideMode && guideContext?.currentStepIndex === 6;
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reviews' | 'account'

  // Ensure activeTab is orders and auto-scroll to delivered order card when on Step 7
  React.useEffect(() => {
    if (isStep7) {
      setActiveTab('orders');
      const scroll = () => {
        const el = document.getElementById('orders-review-trigger');
        const mainEl = document.querySelector('main');
        if (el && mainEl) {
          const mainRect = mainEl.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const targetTop = mainEl.scrollTop + (elRect.top - mainRect.top) - 15;
          mainEl.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        }
      };
      scroll();
      const t1 = setTimeout(scroll, 100);
      const t2 = setTimeout(scroll, 350);
      const t3 = setTimeout(scroll, 700);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isStep7]);
  const [orders, setOrders] = useState([
    {
      id: 'MYN-89342',
      date: 'Aug 24, 2026',
      status: 'Delivered',
      deliveryText: 'Delivered on Sunday, Aug 24',
      isDelivered: true,
      returnWindowDays: 2,
      product: {
        id: 'prod_1',
        brand: 'Roadster',
        name: 'Men Slim Fit Casual Checked Shirt',
        category: 'clothing',
        finalPrice: 649,
        sizeBought: 'M',
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80']
      },
      hasReviewed: false
    },
    {
      id: 'MYN-78190',
      date: 'Aug 18, 2026',
      status: 'Delivered',
      deliveryText: 'Delivered on Monday, Aug 18',
      isDelivered: true,
      returnWindowDays: 0,
      product: {
        id: 'prod_5',
        brand: 'Campus',
        name: 'Men North Running & Training Shoes',
        category: 'footwear',
        finalPrice: 1199,
        sizeBought: 'UK 9',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80']
      },
      hasReviewed: true,
      reviewDetails: {
        rating: 5,
        badges: ['Feels 100% Genuine', 'Fits as Expected', 'Comfort Level as Described'],
        text: 'Sole cushion is super responsive for daily 5k morning jogs. Sizing is spot-on UK 9.',
        helpfulCount: 112
      }
    },
    {
      id: 'MYN-99124',
      date: 'Aug 28, 2026',
      status: 'In Transit',
      deliveryText: 'Arriving Today by 8:00 PM',
      isDelivered: false,
      product: {
        id: 'prod_7',
        brand: 'Highlander',
        name: 'Men Slim Fit Denim Casual Jacket',
        category: 'clothing',
        finalPrice: 1484,
        sizeBought: 'L',
        images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80']
      },
      hasReviewed: false
    },
    {
      id: 'MYN-64210',
      date: 'Aug 12, 2026',
      status: 'Returned & Refunded',
      deliveryText: 'Refund of ₹1,899 credited to UPI on Aug 14',
      isDelivered: false,
      isReturned: true,
      product: {
        id: 'prod_16',
        brand: 'Libas',
        name: 'Women Pure Cotton Embroidered Kurta Set',
        category: 'clothing',
        finalPrice: 1899,
        sizeBought: 'S',
        images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80']
      },
      hasReviewed: false
    }
  ]);

  const [userReviews] = useState([
    {
      id: 'rev_user_1',
      productId: 'prod_5',
      brand: 'Campus',
      productName: 'Men North Running & Training Shoes',
      category: 'footwear',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'Aug 19, 2026',
      verifiedBadge: 'Verified Buyer',
      badges: [
        { label: 'Feels 100% Genuine', type: 'authenticity' },
        { label: 'Fits as Expected', type: 'fit' },
        { label: 'Comfort Level as Described', type: 'comfort' }
      ],
      comment: 'Sole cushion is super responsive for daily 5k morning jogs. Sizing is spot-on UK 9. Excellent breathability.',
      helpful: 112
    },
    {
      id: 'rev_user_2',
      productId: 'prod_18',
      brand: 'Versace',
      productName: 'Eros Eau De Parfum - 100ml',
      category: 'fragrance',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'Aug 04, 2026',
      verifiedBadge: 'Verified Luxury Buyer',
      badges: [
        { label: 'Feels 100% Genuine', type: 'authenticity' },
        { label: 'Matches Scent Description', type: 'photoMatch' },
        { label: 'Premium Long-lasting Finish', type: 'finish' }
      ],
      comment: 'Batch code checked and verified genuine. Fresh mint & vanilla dry-down lasts over 9 hours. Hologram intact.',
      helpful: 340
    },
    {
      id: 'rev_user_3',
      productId: 'prod_22',
      brand: 'Philips',
      productName: 'SilkProtect Hair Straightener',
      category: 'appliances',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'Jul 28, 2026',
      verifiedBadge: 'Verified Appliance Buyer',
      badges: [
        { label: 'Feels 100% Genuine', type: 'authenticity' },
        { label: 'Matches Catalog Specifications', type: 'photoMatch' },
        { label: 'High Build Durability', type: 'finish' }
      ],
      comment: 'Heats up in 30 seconds. Ceramic plates glide smoothly without snagging hair. Comes with official 2-year warranty card.',
      helpful: 89
    }
  ]);

  const handleOpenReview = (product) => {
    openReviewModal(product);
  };

  const handleReturn = (orderId) => {
    showToast(`Return requested for Order #${orderId}. Courier pickup scheduled within 24h.`);
  };

  return (
    <div className="flex-1 bg-[#F5F5F6] pb-16 select-none relative min-h-full">
      
      {/* 1. USER PROFILE IDENTITY HERO */}
      <div className="bg-white p-4 border-b border-[#EAEAEC] shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF3F6C] to-[#FF905A] flex items-center justify-center text-white font-black text-xl shadow-xs">
              A
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#03A685] text-white p-0.5 rounded-full border-2 border-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-[#282C3F] truncate">
                Aarav Sharma
              </h2>
              <span className="text-[9px] font-extrabold bg-[#03A685]/15 text-[#047857] px-1.5 py-0.5 rounded border border-[#03A685]/30">
                Verified Buyer
              </span>
            </div>
            <p className="text-xs text-[#535766] truncate mt-0.5">
              aarav.sharma@myntra.user
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#94969F]">
              <span><strong>14</strong> Orders</span>
              <span>•</span>
              <span><strong>3</strong> Published Reviews</span>
              <span>•</span>
              <span className="text-[#03A685] font-bold">100% Trust Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROFILE SEGMENT TABS */}
      <div className="bg-white px-2 pt-2 border-b border-[#EAEAEC] sticky top-0 z-10">
        <div className="grid grid-cols-4 gap-1 text-center">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#FF3F6C] text-[#FF3F6C]'
                : 'border-transparent text-[#535766] hover:text-[#282C3F]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-[#FF3F6C] text-[#FF3F6C]'
                : 'border-transparent text-[#535766] hover:text-[#282C3F]'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>My Reviews</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'badges'
                ? 'border-[#FF3F6C] text-[#FF3F6C]'
                : 'border-transparent text-[#535766] hover:text-[#282C3F]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Badges</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'account'
                ? 'border-[#FF3F6C] text-[#FF3F6C]'
                : 'border-transparent text-[#535766] hover:text-[#282C3F]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* 3. TAB CONTENT: ORDERS & RETURNS */}
      {activeTab === 'orders' && (
        <div className="p-3 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-[#282C3F] uppercase tracking-wider">
              Recent Purchases & Returns
            </h3>
            <span className="text-[10px] text-[#94969F] font-bold">Showing All {orders.length} Orders</span>
          </div>

          {/* Pending Reviews Notice Card */}
          {orders.some((o) => o.isDelivered && !o.hasReviewed) && (
            <div className="bg-gradient-to-r from-[#FFF0F3] to-[#FFF5F7] border border-[#FF3F6C]/30 rounded-xl p-3 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF3F6C]/15 text-[#FF3F6C] flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 fill-[#FF3F6C]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#282C3F]">Pending Product Reviews</h4>
                  <p className="text-[10px] text-[#535766]">Rate delivered items & submit verified badges</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const unreviewed = orders.find((o) => o.isDelivered && !o.hasReviewed);
                  if (unreviewed) handleOpenReview(unreviewed.product);
                }}
                className="px-2.5 py-1.5 bg-[#FF3F6C] hover:bg-[#E0355E] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs"
              >
                Rate Now
              </button>
            </div>
          )}

          {orders.map((order) => {
            const p = order.product;
            const img = getProductImageUrl(p.images?.[0], p.category, 1);
            const isTargetOrder = order.id === 'MYN-89342';

            return (
              <div
                key={order.id}
                id={isTargetOrder ? 'orders-review-trigger' : undefined}
                className={`bg-white rounded-2xl p-3 border transition-all duration-300 space-y-3 ${
                  isStep7 && isTargetOrder
                    ? 'ring-2 ring-[#FF3F6C] shadow-[0_0_20px_rgba(255,63,108,0.25)] border-[#FF3F6C]'
                    : 'border-[#EAEAEC] shadow-2xs'
                }`}
              >
                {/* Order Status Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F6]">
                  <div className="flex items-center gap-1.5">
                    {order.isDelivered ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#03A685]" />
                    ) : order.isReturned ? (
                      <RotateCcw className="w-3.5 h-3.5 text-[#9333EA]" />
                    ) : (
                      <Truck className="w-3.5 h-3.5 text-[#2563EB] animate-bounce" />
                    )}
                    <span
                      className={`text-[11px] font-black ${
                        order.isDelivered
                          ? 'text-[#03A685]'
                          : order.isReturned
                          ? 'text-[#9333EA]'
                          : 'text-[#2563EB]'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#94969F] font-semibold">
                    Order #{order.id}
                  </span>
                </div>

                {/* Product Info Row */}
                <div
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={img}
                    alt={p.name}
                    className="w-14 h-16 object-cover object-top rounded-xl border border-[#EAEAEC] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-black text-[#282C3F] uppercase tracking-wide truncate block group-hover:text-[#FF3F6C] transition-colors">
                      {p.brand}
                    </span>
                    <p className="text-[11px] text-[#535766] truncate font-medium">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-[#282C3F]">₹{p.finalPrice}</span>
                      <span className="text-[10px] text-[#94969F]">Size: <strong>{p.sizeBought}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Delivery details note */}
                <p className="text-[10px] text-[#535766] bg-[#F9F9FB] p-2 rounded-lg font-medium">
                  {order.deliveryText}
                </p>

                {/* Action Buttons for this order */}
                <div className="flex items-center gap-2 pt-1">
                  {order.isDelivered && !order.hasReviewed && (
                    <div className="flex-1 relative flex flex-col gap-1">
                      {isStep7 && isTargetOrder && (
                        <div className="animate-bounce flex items-center justify-center gap-1 text-[10px] font-black text-[#FF3F6C] bg-[#FFF0F3] border border-[#FF3F6C]/40 py-1 px-2 rounded-lg shadow-xs">
                          <span>👇 Tap below to open Verified Review Form</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenReview(p)}
                        className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                          isStep7 && isTargetOrder
                            ? 'bg-[#FF3F6C] text-white hover:bg-[#E0355E] ring-4 ring-[#FF3F6C]/30 shadow-md scale-[1.01]'
                            : 'bg-[#FFF0F3] hover:bg-[#FFE0E7] text-[#FF3F6C] border border-[#FF3F6C]/30'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isStep7 && isTargetOrder ? 'fill-white text-white' : 'fill-[#FF3F6C] text-[#FF3F6C]'}`} />
                        <span>Rate & Submit Badges</span>
                      </button>
                    </div>
                  )}

                  {order.isDelivered && order.hasReviewed && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="flex-1 py-2 bg-[#E8F8F5] text-[#14958F] border border-[#14958F]/30 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Badges Published ✓</span>
                    </button>
                  )}

                  {order.returnWindowDays > 0 && (
                    <button
                      type="button"
                      onClick={() => handleReturn(order.id)}
                      className="py-2 px-3 bg-white hover:bg-[#F5F5F6] text-[#535766] border border-[#D4D5D9] rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>Return / Exchange</span>
                    </button>
                  )}

                  {!order.isDelivered && !order.isReturned && (
                    <button
                      type="button"
                      onClick={() => showToast('Courier is out for delivery. Estimated by 8 PM.')}
                      className="flex-1 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Shipment</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. TAB CONTENT: MY REVIEWS & TRUST BADGES */}
      {activeTab === 'reviews' && (
        <div className="p-3 space-y-3.5 animate-fade-in">
          
          {/* Badge Trophy Case Summary */}
          <div className="bg-gradient-to-r from-[#282C3F] to-[#1F2937] text-white rounded-2xl p-3.5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#FF905A] uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#FF905A]" />
                <span>My Trust Trophy Case</span>
              </div>
              <span className="text-[10px] font-bold text-gray-300 bg-white/10 px-2 py-0.5 rounded-full">
                Level 4 Reviewer
              </span>
            </div>

            {/* 4 Core Badges Showcase */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-gray-300 uppercase font-black block">🛡️ Authenticity</span>
                <span className="text-xs font-black text-white">8 Products Verified</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-gray-300 uppercase font-black block">📏 Fit Accuracy</span>
                <span className="text-xs font-black text-white">6 Sizing Guides</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-gray-300 uppercase font-black block">📸 Photo Match</span>
                <span className="text-xs font-black text-white">5 Color Fidelity</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-gray-300 uppercase font-black block">🧵 Fabric / Texture</span>
                <span className="text-xs font-black text-white">7 Feel Validated</span>
              </div>
            </div>
          </div>

          {/* User's Published Reviews List */}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-[#282C3F] uppercase tracking-wider">
              My Verified Community Reviews
            </h3>
            <span className="text-[10px] text-[#94969F] font-bold">{userReviews.length} Published</span>
          </div>

          {userReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-3 border border-[#EAEAEC] shadow-2xs space-y-2.5"
            >
              {/* Product Header */}
              <div
                onClick={() => navigate(`/product/${rev.productId}`)}
                className="flex items-center gap-2.5 pb-2 border-b border-[#F5F5F6] cursor-pointer group"
              >
                <img
                  src={rev.image}
                  alt={rev.productName}
                  className="w-10 h-12 object-cover object-top rounded-lg border border-[#EAEAEC] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-black text-[#282C3F] uppercase tracking-wide truncate block group-hover:text-[#FF3F6C]">
                    {rev.brand}
                  </span>
                  <p className="text-[11px] text-[#535766] truncate font-medium">
                    {rev.productName}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94969F] group-hover:text-[#FF3F6C] group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Rating & Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5 bg-[#03A685] text-white px-1.5 py-0.5 rounded text-[10px] font-black">
                    <span>{rev.rating}</span>
                    <Star className="w-2.5 h-2.5 fill-white" />
                  </div>
                  <span className="text-[10px] font-black text-[#14958F] ml-1">
                    ✓ {rev.verifiedBadge}
                  </span>
                </div>
                <span className="text-[10px] text-[#94969F]">{rev.date}</span>
              </div>

              {/* Contributed Trust Badges */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {rev.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#E8F8F5] border border-[#14958F]/25 text-[#14958F] text-[9px] font-black px-2 py-0.5 rounded-full"
                  >
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>{b.label}</span>
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-[11px] text-[#282C3F] leading-relaxed font-normal bg-[#F9F9FB] p-2 rounded-lg">
                "{rev.comment}"
              </p>

              {/* Helpful Votes Count */}
              <div className="flex items-center justify-between text-[10px] text-[#535766] pt-1 border-t border-[#F5F5F6]">
                <span className="flex items-center gap-1 text-[#03A685] font-black">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{rev.helpful} buyers found this helpful</span>
                </span>
                <span className="text-[#94969F] font-semibold">Active in Community</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. TAB CONTENT: ACCOUNT SETTINGS & TRUST GUARANTEE */}
      {activeTab === 'account' && (
        <div className="p-3 space-y-3 animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#EAEAEC] overflow-hidden divide-y divide-[#EAEAEC]">
            <div
              onClick={() => navigate('/wishlist')}
              className="p-3 flex items-center justify-between hover:bg-[#F5F5F6] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-[#FF3F6C]" />
                <div>
                  <h4 className="text-xs font-bold text-[#282C3F]">My Wishlist</h4>
                  <p className="text-[10px] text-[#94969F]">{wishlistCount} items saved</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94969F]" />
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#F5F5F6] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#282C3F]" />
                <div>
                  <h4 className="text-xs font-bold text-[#282C3F]">Saved Delivery Addresses</h4>
                  <p className="text-[10px] text-[#94969F]">Prestige Towers, 4th Block, Koramangala</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94969F]" />
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#F5F5F6] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-[#282C3F]" />
                <div>
                  <h4 className="text-xs font-bold text-[#282C3F]">Payment Methods & Myntra Credit</h4>
                  <p className="text-[10px] text-[#03A685] font-bold">₹12 Myntra Cash Active</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94969F]" />
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#F5F5F6] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#14958F]" />
                <div>
                  <h4 className="text-xs font-bold text-[#282C3F]">100% Authenticity Guarantee</h4>
                  <p className="text-[10px] text-[#94969F]">Verified Brand Sourced SKUs</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94969F]" />
            </div>
          </div>

          <div className="text-center pt-4 text-[10px] text-[#94969F]">
            <p className="font-bold text-[#535766]">Myntra Trust-Tags MVP</p>
            <p>Version 2.0.0 • Connected to Local SQLite DB</p>
          </div>
        </div>
      )}
    </div>
  );
}
