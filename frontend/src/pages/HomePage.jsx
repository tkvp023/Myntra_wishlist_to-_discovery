import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import { useGuide } from '../context/GuideContext';
import ProductCard from '../components/home/ProductCard';
import SavedItemMilestoneCard from '../components/home/SavedItemMilestoneCard';
import {
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Play,
  Percent,
  X
} from 'lucide-react';
import { getProductImageUrl } from '../utils/imageHelper';

const MAIN_TABS = [
  { id: 'all', label: 'ALL' },
  { id: 'men', label: 'MEN' },
  { id: 'women', label: 'WOMEN' },
  { id: 'beauty', label: 'BEAUTY' },
  { id: 'kids', label: 'KIDS' }
];

// Division-Specific Story Squircle Bubbles
const DIVISION_CATEGORIES = {
  all: [
    { id: 'clothing', subcategory: null, title: 'Fashion', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80' },
    { id: 'makeup', subcategory: null, title: 'Beauty', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80' },
    { id: 'footwear', subcategory: null, title: 'Footwear', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&auto=format&fit=crop&q=80' },
    { id: 'bags', subcategory: null, title: 'Accessories', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=80' },
    { id: 'appliances', subcategory: null, title: 'Appliances', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80' },
    { id: 'jewelry', subcategory: null, title: 'Jewelry', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80' }
  ],
  women: [
    { id: 'clothing', subcategory: 'Sarees', title: 'Sarees', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80' },
    { id: 'clothing', subcategory: 'Lehenga Choli', title: 'Lehengas', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&auto=format&fit=crop&q=80' },
    { id: 'clothing', subcategory: 'Kurtis', title: 'Kurtis', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&auto=format&fit=crop&q=80' },
    { id: 'clothing', subcategory: 'Dresses', title: 'Dresses', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80' },
    { id: 'footwear', subcategory: null, title: 'Footwear', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&auto=format&fit=crop&q=80' },
    { id: 'bags', subcategory: null, title: 'Handbags', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80' }
  ],
  men: [
    { id: 'clothing', subcategory: 'T-Shirts', title: 'T-Shirts', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
    { id: 'clothing', subcategory: 'Shirts', title: 'Shirts', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop&q=80' },
    { id: 'clothing', subcategory: 'Trousers', title: 'Chinos', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&auto=format&fit=crop&q=80' },
    { id: 'clothing', subcategory: 'Trousers', title: 'Cargos', img: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=300&auto=format&fit=crop&q=80' },
    { id: 'footwear', subcategory: null, title: 'Sneakers', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80' },
    { id: 'clothing', subcategory: 'Jackets', title: 'Jackets', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&auto=format&fit=crop&q=80' }
  ],
  beauty: [
    { id: 'makeup', subcategory: null, title: 'Makeup', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&auto=format&fit=crop&q=80' },
    { id: 'skincare', subcategory: null, title: 'Skincare', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80' },
    { id: 'fragrance', subcategory: null, title: 'Perfumes', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&auto=format&fit=crop&q=80' },
    { id: 'appliances', subcategory: null, title: 'Styling', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80' }
  ],
  kids: [
    { id: 'clothing', subcategory: 'T-Shirts', title: 'Boys Tees', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&auto=format&fit=crop&q=80' },
    { id: 'clothing', subcategory: 'Dresses', title: 'Girls Frocks', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80' },
    { id: 'footwear', subcategory: null, title: 'Kids Kicks', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80' }
  ]
};

// 4 Curated Shifting Ad Banner Slides
const HERO_SLIDES = [
  {
    id: 1,
    brand: 'HERE & NOW | Mast & Harbour',
    tag: '& More',
    title: 'Everyday Wardrobe Staple',
    subtitle: 'Under ₹499 • #WardrobeEssential',
    cta: 'Explore Casuals',
    theme: 'from-[#FDF6F0] via-[#F8ECE3] to-[#EDD7C8]',
    textColor: 'text-[#282C3F]',
    img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    category: 'clothing',
    gender: 'men'
  },
  {
    id: 2,
    brand: 'Biba | Mitera | Zeel',
    tag: 'Trending',
    title: 'Sarees & Festive Lehengas',
    subtitle: 'Min. 50% OFF • #RoyalEthnic',
    cta: 'Shop Festive',
    theme: 'from-[#FFF0F5] via-[#FFE4EC] to-[#FDD3DF]',
    textColor: 'text-[#881337]',
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    category: 'clothing',
    gender: 'women'
  },
  {
    id: 3,
    brand: 'PUMA | Campus | HRX',
    tag: 'Hot Drop',
    title: 'Sneakerhead & Tees Rush',
    subtitle: 'Starting ₹499 • #StreetStyle',
    cta: 'View Kicks & Tees',
    theme: 'from-[#F0F7FF] via-[#E0EFFF] to-[#CCE4FF]',
    textColor: 'text-[#1E3A8A]',
    img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
    category: 'footwear',
    gender: 'men'
  },
  {
    id: 4,
    brand: 'Versace | M.A.C | Philips',
    tag: '100% Genuine',
    title: 'Luxe Beauty & Styling',
    subtitle: 'Up to 30% OFF • #VerifiedLuxe',
    cta: 'Discover Beauty',
    theme: 'from-[#FAF6F0] via-[#F5ECE0] to-[#EADBCA]',
    textColor: 'text-[#451A03]',
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    category: 'makeup',
    gender: 'beauty'
  }
];

// Helper to format ultra-compact dual stats on one line
const getCompactTrustStats = (item) => {
  const highlights = item.reengagement?.badgeHighlights || [];
  if (highlights.length >= 2 && !highlights[0].belowThreshold && !highlights[1].belowThreshold) {
    const s1 = `${highlights[0].percent}% ${highlights[0].label.replace('Feels ', '').replace(' as Expected', '')}`;
    const s2 = `${highlights[1].percent}% ${highlights[1].label.replace('Feels ', '').replace(' as Expected', '')}`;
    return `${s1} · ${s2}`;
  } else if (highlights.length >= 1) {
    const h = highlights[0];
    return !h.belowThreshold
      ? `${h.percent}% ${h.label}`
      : '🔥 Trending: Gaining momentum';
  }
  return 'Verified Buyer SKU';
};

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { wishlist } = useApp();

  const initialGender = searchParams.get('gender') || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const initialSubcategory = searchParams.get('subcategory') || 'all';

  const [activeMainTab, setActiveMainTab] = useState(initialGender);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-shifting Ad Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-shift timer every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNextSlide = (e) => {
    e?.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = (e) => {
    e?.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Fetch catalog filtered by gender, category, and subcategory
  const fetchCatalog = async (genderTab, categoryFilter, subcategoryFilter) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts({
        gender: genderTab === 'all' ? null : genderTab,
        category: categoryFilter === 'all' ? null : categoryFilter,
        subcategory: subcategoryFilter === 'all' ? null : subcategoryFilter
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Could not load products. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (tabId) => {
    setActiveMainTab(tabId);
    setSelectedCategory('all');
    setSelectedSubcategory('all');
  };

  const handleSquircleSelect = (bubble) => {
    if (selectedCategory === bubble.id && selectedSubcategory === (bubble.subcategory || 'all')) {
      // Toggle off
      setSelectedCategory('all');
      setSelectedSubcategory('all');
    } else {
      setSelectedCategory(bubble.id);
      setSelectedSubcategory(bubble.subcategory || 'all');
    }
  };

  const { isGuideMode, currentStepIndex } = useGuide();

  // Scroll to saved-items-section when landing on Step 2
  useEffect(() => {
    if (!isGuideMode || currentStepIndex !== 1 || loading) return;

    const scroll = () => {
      const el = document.getElementById('saved-items-section');
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
  }, [isGuideMode, currentStepIndex, loading]);

  useEffect(() => {
    fetchCatalog(activeMainTab, selectedCategory, selectedSubcategory);
  }, [activeMainTab, selectedCategory, selectedSubcategory]);

  // Section 8 Final Spec: Filter wishlisted items with verified positive stats
  const qualifyingWishlistItems = wishlist.filter(
    (item) => item.reengagement?.hasData && item.reengagement?.message
  );

  const currentSlide = HERO_SLIDES[activeSlide];
  const activeSquircles = DIVISION_CATEGORIES[activeMainTab] || DIVISION_CATEGORIES.all;

  return (
    <div className="flex-1 flex flex-col bg-white pb-6 select-none">
      
      {/* 1. SOFT PEACH HEADER WITH DIVISION TABS (ALL | MEN | WOMEN | BEAUTY | KIDS + 4-Dot Grid) */}
      <div className="bg-gradient-to-b from-[#FFF0F3] to-[#FFFFFF] pt-1.5 px-3 border-b border-[#F5F5F6]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
            {MAIN_TABS.map((tab) => {
              const isActive = activeMainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`py-1 px-3 rounded-full text-[11px] font-black tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#FF3F6C] shadow-xs border border-[#FF3F6C]/20'
                      : 'text-[#535766] hover:text-[#282C3F]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 4-Dot Category Grid Icon */}
          <button
            onClick={() => navigate('/categories')}
            aria-label="All Categories"
            className="p-1.5 ml-1 text-[#282C3F] hover:text-[#FF3F6C] transition-colors cursor-pointer flex-shrink-0"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* 2. DYNAMIC DIVISION-SPECIFIC SQUIRCLE TILES CAROUSEL */}
        <div className="flex items-center gap-2 py-1.5 overflow-x-auto no-scrollbar">
          {activeSquircles.map((bubble, idx) => {
            const isSelected = selectedCategory === bubble.id && 
              (bubble.subcategory ? selectedSubcategory === bubble.subcategory : selectedSubcategory === 'all');

            return (
              <button
                key={idx}
                onClick={() => handleSquircleSelect(bubble)}
                className="flex flex-col items-center gap-1 min-w-[52px] transition-transform active:scale-95 cursor-pointer"
              >
                <div
                  className={`w-11 h-12 rounded-xl overflow-hidden shadow-2xs border-2 transition-all relative ${
                    isSelected ? 'border-[#FF3F6C] scale-105 shadow-xs' : 'border-transparent hover:border-[#D4D5D9]'
                  }`}
                >
                  <img
                    src={bubble.img}
                    alt={bubble.title}
                    className="w-full h-full object-cover object-top"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#FF3F6C]/10"></div>
                  )}
                </div>
                <span
                  className={`text-[9px] truncate max-w-[54px] leading-tight ${
                    isSelected ? 'font-black text-[#FF3F6C]' : 'font-bold text-[#282C3F]'
                  }`}
                >
                  {bubble.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE FILTER PILL NOTIFICATION */}
      {(selectedCategory !== 'all' || selectedSubcategory !== 'all') && (
        <div className="mx-3 mt-2 px-2.5 py-1 bg-[#FFF0F3] border border-[#FF3F6C]/25 rounded-lg flex items-center justify-between">
          <span className="text-[10px] font-black text-[#FF3F6C]">
            Filter: {selectedSubcategory !== 'all' ? selectedSubcategory : selectedCategory.toUpperCase()} ({products.length} items)
          </span>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            className="p-0.5 text-[#FF3F6C] hover:bg-white rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SEQUENCE 1: COUPONS STRIP */}
      <div className="mx-3 mt-1.5 bg-[#FFF5F7] border border-[#FF3F6C]/20 rounded-xl px-2.5 py-1.5 flex items-center justify-between shadow-2xs relative overflow-hidden">
        <div className="flex items-center gap-2 z-10">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] font-black text-[#FF3F6C]">Get 25% Off</span>
              <span className="text-[9px] text-[#535766] font-bold">Up To ₹200 Off*</span>
            </div>
            <p className="text-[8px] text-[#94969F]">
              *On your first order | T&C apply
            </p>
          </div>
        </div>

        {/* Dotted Coupon Code Pill */}
        <div className="z-10 flex items-center gap-1 bg-white border border-dashed border-[#FF3F6C] rounded-md px-1.5 py-0.5 shadow-2xs">
          <span className="text-[8px] font-bold text-[#535766]">COUPON:</span>
          <span className="text-[9px] font-black text-[#FF3F6C]">MYNTRASAVE</span>
        </div>

        <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-[#FF3F6C]/10 rounded-full flex items-center justify-center pointer-events-none">
          <Percent className="w-4 h-4 text-[#FF3F6C]/40" />
        </div>
      </div>

      {/* SEQUENCE 2: RESIZED SHIFTING ADS HERO BANNER */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onClick={() => {
          setActiveMainTab(currentSlide.gender || 'all');
          setSelectedCategory(currentSlide.category);
        }}
        className={`mx-3 mt-2 relative rounded-2xl overflow-hidden shadow-2xs border border-[#EAEAEC] bg-gradient-to-r ${currentSlide.theme} transition-all duration-500 cursor-pointer group`}
      >
        <div className="flex items-center justify-between p-3 h-36">
          {/* Left Column: Brand, Headline, Subtitle, Price & CTA */}
          <div className="flex-1 pr-2.5 flex flex-col justify-between h-full z-10">
            <div>
              {/* Brand Pill */}
              <div className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-2xs border border-white/60 mb-1.5">
                <span className="text-[9px] font-black text-[#282C3F] tracking-tight truncate max-w-[130px]">
                  {currentSlide.brand}
                </span>
                <span className="text-[7px] font-extrabold text-[#FF3F6C] bg-[#FFF0F3] px-1 rounded">
                  {currentSlide.tag}
                </span>
              </div>

              {/* Title */}
              <h2 className={`text-xs font-black leading-tight ${currentSlide.textColor} line-clamp-1`}>
                {currentSlide.title}
              </h2>
              <p className="text-[9px] font-bold text-[#535766] mt-0.5 line-clamp-1">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* CTA Pill */}
            <div className="flex items-center gap-1 text-[9px] font-black text-[#FF3F6C]">
              <span>{currentSlide.cta}</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Right Column: Dedicated Framed Portrait Visual */}
          <div className="w-28 h-full rounded-xl overflow-hidden shadow-xs border border-white/80 bg-white/60 flex-shrink-0 relative">
            <img
              key={currentSlide.id}
              src={currentSlide.img}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center animate-fade-in transition-all duration-500"
            />
          </div>
        </div>

        {/* Previous / Next Manual Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrevSlide}
          aria-label="Previous slide"
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/85 text-[#282C3F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm cursor-pointer z-20"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="Next slide"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/85 text-[#282C3F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm cursor-pointer z-20"
        >
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Carousel Indicator Dots */}
        <div className="pb-1.5 flex items-center justify-center gap-1.5">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlide(idx);
              }}
              aria-label={`Slide ${idx + 1}`}
              className={`rounded-full transition-all cursor-pointer ${
                activeSlide === idx
                  ? 'w-3.5 h-1 bg-[#FF3F6C]'
                  : 'w-1.5 h-1 bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* SEQUENCE 3: ⭐ WISHLIST TRUST SUGGESTIONS SHELF */}
      {selectedCategory === 'all' && selectedSubcategory === 'all' && (
        <>
          {/* MODE 1: EXACTLY 1 QUALIFYING ITEM → Single-Item Stat Card (Taps through to Product Page) */}
          {qualifyingWishlistItems.length === 1 && (() => {
            const single = qualifyingWishlistItems[0];
            const p = single.product;
            const img = getProductImageUrl(p?.images?.[0], p?.category, 1);
            const compactStats = getCompactTrustStats(single);
            const daysSaved = single.daysStalled || 4;
            const deepLink = `/product/${p.id}`;

            return (
              <div
                id="saved-items-section"
                onClick={() => navigate(deepLink)}
                className="mx-3 mt-2 p-2 bg-gradient-to-r from-[#FFF0F3] to-[#FFF8F9] border border-[#FF3F6C]/25 rounded-xl shadow-2xs cursor-pointer hover:border-[#FF3F6C] transition-all group animate-fade-in"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1 text-[9px] font-black text-[#FF3F6C] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#FF3F6C]" />
                    <span>Wishlist Trust Signal</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#FF3F6C] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>See Reviews</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <div className="flex items-center gap-2.5 bg-white rounded-lg p-2 border border-[#FF3F6C]/15 shadow-2xs">
                  <img
                    src={img}
                    alt={p.name}
                    className="w-11 h-13 object-cover object-top rounded-md border border-[#EAEAEC] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-black text-[#282C3F] truncate group-hover:text-[#FF3F6C]">
                      {p.brand}
                    </h4>
                    <p className="text-[10px] text-[#535766] truncate font-normal leading-tight">
                      {p.name}
                    </p>
                    
                    {/* Days-Saved Tag */}
                    <span className="text-[8px] text-[#94969F] font-semibold block mt-0.5">
                      Saved {daysSaved}d ago
                    </span>

                    {/* Compact Stat (Single or Dual on 1 line) */}
                    <div className="mt-1 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-black text-[#047857] bg-gradient-to-r from-[#E6F8F4] to-[#D2F5EC] px-2 py-0.5 rounded-md border border-[#03A685]/35 truncate max-w-[160px] shadow-2xs">
                        <ShieldCheck className="w-2.5 h-2.5 text-[#03A685] stroke-[2.5] flex-shrink-0" />
                        <span className="truncate tracking-tight">{compactStats}</span>
                      </span>

                      {/* Micro-CTA */}
                      <span className="text-[8px] font-black text-[#FF3F6C] flex items-center gap-0.5 group-hover:underline">
                        <span>See why</span>
                        <span className="text-[9px]">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* MODE 2: 2 OR MORE QUALIFYING ITEMS → Multi-Item Compact Scroll Shelf (Taps through to Wishlist Page) */}
          {qualifyingWishlistItems.length >= 2 && (
            <div id="saved-items-section" className="mx-3 mt-2 p-2 bg-gradient-to-r from-[#FFF0F3] to-[#FFF8F9] border border-[#FF3F6C]/25 rounded-xl shadow-2xs animate-fade-in">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1 text-[9px] font-black text-[#FF3F6C] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#FF3F6C]" />
                  <span>{qualifyingWishlistItems.length} Saved Items with Trust Milestones</span>
                </div>
                {/* Final Spec: Multi-item summary taps through to Wishlist Page */}
                <button
                  onClick={() => navigate('/wishlist')}
                  className="text-[9px] font-black text-[#FF3F6C] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View Wishlist</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {qualifyingWishlistItems.map((item, idx) => {
                  const compactStats = getCompactTrustStats(item);
                  const daysSaved = item.daysStalled || (idx + 2);

                  return (
                    <SavedItemMilestoneCard
                      key={item.id}
                      item={item}
                      idx={idx}
                      isHighlighted={idx === 0}
                      highlightLabel="Trending pick"
                      compactStats={compactStats}
                      daysSaved={daysSaved}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* 5. CASHBACK STRIP */}
      <div className="mx-3 mt-2 bg-[#F9F9FB] border border-[#EAEAEC] rounded-xl p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 rounded bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] flex items-center justify-center text-white text-[7px] font-black">
            CARD
          </div>
          <div className="text-[9px] text-[#282C3F] font-bold">
            Get 7.5%* Cashback On Myntra
            <span className="block text-[8px] text-[#94969F] font-normal">With FLIPKART AXIS BANK & SBI Credit Cards</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="text-[9px] font-black text-[#FF3F6C] hover:underline cursor-pointer"
        >
          Apply &gt;
        </button>
      </div>

      {/* 6. PLAY TO SLAY POPULAR STYLES SHELF */}
      <div className="mx-3 mt-3 relative">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-xs font-black text-[#282C3F] uppercase tracking-wider">
            {selectedSubcategory !== 'all'
              ? `${selectedSubcategory.toUpperCase()} SELECTION`
              : selectedCategory !== 'all'
              ? `${selectedCategory.toUpperCase()} PICKS`
              : `${activeMainTab.toUpperCase()} PICKS`}
          </h2>
          <span className="text-[10px] font-black text-[#FF3F6C]">
            {products.length} Items
          </span>
        </div>

        {/* Floating "PLAY TO SLAY" Pill Button */}
        <div className="flex justify-center -mb-3 relative z-10">
          <button
            onClick={() => navigate('/categories')}
            className="bg-[#0F172A] text-white px-3.5 py-1 rounded-full text-[9px] font-black tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer hover:bg-black"
          >
            <Play className="w-2.5 h-2.5 fill-white" />
            <span>PLAY TO SLAY</span>
          </button>
        </div>
      </div>

      {/* 7. TWO-COLUMN PRODUCT GRID */}
      {loading ? (
        <div className="grid grid-cols-2 gap-2 px-3 pt-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="animate-pulse flex flex-col">
              <div className="w-full pb-[133%] bg-[#F5F5F6] rounded-sm"></div>
              <div className="h-3 bg-[#F5F5F6] rounded mt-2 w-3/4"></div>
              <div className="h-2.5 bg-[#F5F5F6] rounded mt-1 w-1/2"></div>
              <div className="h-3 bg-[#F5F5F6] rounded mt-1.5 w-2/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <p className="text-xs text-[#D5284F] mb-3">{error}</p>
          <button
            onClick={() => fetchCatalog(activeMainTab, selectedCategory, selectedSubcategory)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF3F6C] border border-[#FF3F6C] px-3 py-1.5 rounded-full cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center text-[#94969F]">
          <p className="text-xs font-bold text-[#535766]">No products found for this filter.</p>
          <button
            onClick={() => {
              setActiveMainTab('all');
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            className="mt-2 text-xs font-bold text-[#FF3F6C] hover:underline cursor-pointer"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-3.5 px-3 pt-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
