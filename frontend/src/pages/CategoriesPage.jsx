import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

const CATEGORY_DIVISIONS = {
  women: [
    {
      group: 'Indian & Festive Wear',
      icon: '🥻',
      items: [
        { name: 'Sarees', subcategory: 'Sarees', count: 'Mitera, Saree mall' },
        { name: 'Lehenga Choli', subcategory: 'Lehenga Choli', count: 'Zeel Clothing, Divastri' },
        { name: 'Kurtis & Anarkalis', subcategory: 'Kurtis', count: 'W for Woman, Aurelia, Anouk' },
        { name: 'Ethnic Kurta Sets', subcategory: 'Kurta Sets', count: 'Libas, Biba' }
      ]
    },
    {
      group: 'Western & Casual Wear',
      icon: '👗',
      items: [
        { name: 'Dresses & Jumpsuits', subcategory: 'Dresses', count: 'Trendyol, MANGO' },
        { name: 'Tops & T-Shirts', subcategory: 'T-Shirts', count: 'H&M, Roadster' },
        { name: 'Jeans & Trousers', subcategory: 'Trousers', count: 'Levis, Highlander' }
      ]
    },
    {
      group: 'Footwear & Bags',
      icon: '👠',
      items: [
        { name: 'Mojari Juttis & Flats', category: 'footwear', count: 'Mochi Handcrafted' },
        { name: 'Block Heels & Stilettos', category: 'footwear', count: 'DressBerry, Mast & Harbour' },
        { name: 'Handbags & Totes', category: 'bags', count: 'Lavie, Baggit' }
      ]
    },
    {
      group: 'Jewelry & Beauty',
      icon: '💍',
      items: [
        { name: 'Fashion Jewelry & Necklaces', category: 'jewelry', count: 'Zaveri Pearls, Shining Diva' },
        { name: 'Makeup & Skincare', category: 'makeup', count: 'Maybelline, Minimalist' }
      ]
    }
  ],
  men: [
    {
      group: 'Topwear',
      icon: '👕',
      items: [
        { name: 'Casual & Formal Shirts', subcategory: 'Shirts', count: 'Roadster, HIGHLANDER' },
        { name: 'T-Shirts & Polos', subcategory: 'T-Shirts', count: 'HRX, WROGN, BAESD, USPA' },
        { name: 'Jackets & Sweatshirts', subcategory: 'Jackets', count: 'Highlander Denim' }
      ]
    },
    {
      group: 'Bottomwear',
      icon: '👖',
      items: [
        { name: 'Chino Trousers & Pants', subcategory: 'Trousers', count: 'HIGHLANDER, INVICTUS' },
        { name: 'Tactical Cargo Pants', subcategory: 'Trousers', count: 'Snitch, Mast & Harbour' },
        { name: 'Jeans & Denims', category: 'clothing', count: 'Roadster, Levis' }
      ]
    },
    {
      group: 'Footwear & Sportswear',
      icon: '👟',
      items: [
        { name: 'Running & Training Shoes', category: 'footwear', count: 'Campus, Puma' },
        { name: 'Casual Sneakers', category: 'footwear', count: 'Puma Smash, Sparx' }
      ]
    },
    {
      group: 'Bags & Accessories',
      icon: '🎒',
      items: [
        { name: 'Backpacks & Laptop Bags', category: 'bags', count: 'Wildcraft, Skybags' },
        { name: 'Perfumes & Grooming', category: 'fragrance', count: 'Denver Envy, Versace' }
      ]
    }
  ],
  beauty: [
    {
      group: 'Makeup Essentials',
      icon: '💄',
      items: [
        { name: 'Lipsticks & Lip Tints', category: 'makeup', count: 'Maybelline Superstay, M.A.C' },
        { name: 'Foundation & Compact', category: 'makeup', count: 'Lakme 9to5, L’Oreal' }
      ]
    },
    {
      group: 'Skincare & Treatments',
      icon: '✨',
      items: [
        { name: 'Face Serums & Toners', category: 'skincare', count: 'Minimalist, The Ordinary' },
        { name: 'Sunscreens & Moisturizers', category: 'skincare', count: 'Neutrogena, Dot & Key' }
      ]
    },
    {
      group: 'Luxury Fragrances',
      icon: '🌸',
      items: [
        { name: 'Eau De Parfum & Sprays', category: 'fragrance', count: 'Versace Eros, Titan Skinn' }
      ]
    },
    {
      group: 'Styling Appliances',
      icon: '⚡',
      items: [
        { name: 'Hair Straighteners & Dryers', category: 'appliances', count: 'Philips SilkProtect, Havells' }
      ]
    }
  ],
  kids: [
    {
      group: 'Boys Fashion',
      icon: '👦',
      items: [
        { name: 'Polo T-Shirts & Shirts', subcategory: 'T-Shirts', count: 'U.S. Polo Assn. Kids' },
        { name: 'Denim Shorts & Jeans', category: 'clothing', count: 'Gini & Jony' }
      ]
    },
    {
      group: 'Girls Fashion',
      icon: '👧',
      items: [
        { name: 'Floral Dresses & Frocks', category: 'clothing', count: 'Peppermint, Max Kids' },
        { name: 'Ethnic Kurta Sets', category: 'clothing', count: 'Biba Girls' }
      ]
    },
    {
      group: 'Footwear & Accessories',
      icon: '👟',
      items: [
        { name: 'Kids Casual Sneakers', category: 'footwear', count: 'Puma Kids, Campus' }
      ]
    }
  ]
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [activeDivision, setActiveDivision] = useState('women'); // 'women' | 'men' | 'beauty' | 'kids'

  const handleSubcategorySelect = (item) => {
    const params = new URLSearchParams();
    params.set('gender', activeDivision);
    if (item.category) params.set('category', item.category);
    if (item.subcategory) params.set('subcategory', item.subcategory);
    navigate(`/?${params.toString()}`);
  };

  const groups = CATEGORY_DIVISIONS[activeDivision] || CATEGORY_DIVISIONS.women;

  return (
    <div className="flex-1 bg-[#F5F5F6] pb-16 select-none">
      
      {/* 1. Header Banner */}
      <div className="bg-white p-3.5 border-b border-[#EAEAEC]">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-[#FF3F6C] uppercase tracking-wider mb-0.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Myntra Catalog</span>
        </div>
        <h2 className="text-sm font-black text-[#282C3F]">
          Explore by Category & Division
        </h2>
        <p className="text-[11px] text-[#535766]">
          Discover authentic verified products across Women, Men, Beauty & Kids
        </p>

        {/* 2. Four Main Division Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {[
            { id: 'women', label: 'WOMEN', icon: '👗' },
            { id: 'men', label: 'MEN', icon: '👔' },
            { id: 'beauty', label: 'BEAUTY', icon: '💄' },
            { id: 'kids', label: 'KIDS', icon: '🧸' }
          ].map((div) => (
            <button
              key={div.id}
              onClick={() => setActiveDivision(div.id)}
              className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                activeDivision === div.id
                  ? 'bg-[#FF3F6C] text-white shadow-xs font-black'
                  : 'bg-[#F5F5F6] text-[#282C3F] hover:bg-[#EAEAEC] font-bold'
              }`}
            >
              <span className="text-sm mb-0.5">{div.icon}</span>
              <span className="text-[10px] tracking-wide">{div.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Category Groups & Subcategories List */}
      <div className="p-3 space-y-3">
        {groups.map((grp, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-[#EAEAEC] overflow-hidden shadow-2xs">
            {/* Group Header */}
            <div className="bg-[#FFF8F9] px-3.5 py-2 border-b border-[#FF3F6C]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{grp.icon}</span>
                <h3 className="text-xs font-black text-[#282C3F] uppercase tracking-wide">
                  {grp.group}
                </h3>
              </div>
              <span className="text-[9px] font-bold text-[#FF3F6C] uppercase">
                {grp.items.length} sections
              </span>
            </div>

            {/* Subcategory Items */}
            <div className="divide-y divide-[#F5F5F6]">
              {grp.items.map((sub, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSubcategorySelect(sub)}
                  className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-[#FFF0F3]/30 transition-colors group cursor-pointer"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="text-xs font-extrabold text-[#282C3F] group-hover:text-[#FF3F6C] transition-colors truncate">
                      {sub.name}
                    </h4>
                    <p className="text-[10px] text-[#94969F] truncate mt-0.5 font-medium">
                      {sub.count}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[#94969F] flex-shrink-0">
                    <span className="text-[9px] font-black text-[#FF3F6C] bg-[#FFF0F3] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop &gt;
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#D4D5D9] group-hover:text-[#FF3F6C] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
