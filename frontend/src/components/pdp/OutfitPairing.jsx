import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check, ShieldCheck, ArrowRight, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Curated complementary style pairs by product category
const OUTFIT_CATALOG = {
  clothing: [
    {
      id: 'outfit_bot_1',
      name: 'Slim Fit Stretch Chinos',
      brand: 'HIGHLANDER',
      category: 'clothing',
      price: 899,
      mrp: 1899,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&auto=format&fit=crop&q=80',
      badge: '91% Fits True',
      size: '32',
      sizes: ['30', '32', '34', '36']
    },
    {
      id: 'outfit_shoe_1',
      name: 'Retro Low-Top Street Sneakers',
      brand: 'Campus',
      category: 'footwear',
      price: 1249,
      mrp: 2499,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
      badge: '95% Genuine',
      size: 'UK 8',
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10']
    },
    {
      id: 'outfit_acc_1',
      name: 'Minimalist Chronograph Watch',
      brand: 'Fossil',
      category: 'jewelry',
      price: 2199,
      mrp: 4999,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&auto=format&fit=crop&q=80',
      badge: '100% Genuine Box',
      size: 'Standard',
      sizes: ['Standard']
    }
  ],
  footwear: [
    {
      id: 'outfit_top_1',
      name: 'Oversized Streetwear Cotton Tee',
      brand: 'Roadster',
      category: 'clothing',
      price: 549,
      mrp: 1299,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
      badge: '94% Photo Match',
      size: 'L',
      sizes: ['M', 'L', 'XL']
    },
    {
      id: 'outfit_jkt_1',
      name: 'Trucker Denim Layering Jacket',
      brand: 'WROGN',
      category: 'clothing',
      price: 1899,
      mrp: 3799,
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&auto=format&fit=crop&q=80',
      badge: 'Pure Fabric Feel',
      size: 'L',
      sizes: ['M', 'L', 'XL']
    }
  ],
  default: [
    {
      id: 'outfit_bag_1',
      name: 'Textured Leatherette Tote Bag',
      brand: 'Baggit',
      category: 'bags',
      price: 1099,
      mrp: 2299,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
      badge: 'Color Verified',
      size: 'One Size',
      sizes: ['One Size']
    },
    {
      id: 'outfit_jewel_1',
      name: 'Gold Plated Layered Chain',
      brand: 'Zaveri Pearls',
      category: 'jewelry',
      price: 499,
      mrp: 1499,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
      badge: '100% Finish Match',
      size: 'Standard',
      sizes: ['Standard']
    }
  ]
};

export default function OutfitPairing({ product }) {
  const { addToBag, showToast } = useApp();
  const [addedItems, setAddedItems] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [isFullLookAdded, setIsFullLookAdded] = useState(false);

  if (!product) return null;

  const outfitItems = OUTFIT_CATALOG[product.category] || OUTFIT_CATALOG.default;
  if (!outfitItems || outfitItems.length === 0) return null;

  // Calculate bundle pricing
  const pairingTotalMrp = outfitItems.reduce((acc, it) => acc + it.mrp, 0);
  const pairingTotalPrice = outfitItems.reduce((acc, it) => acc + it.price, 0);
  const bundleDiscountPercent = Math.round(((pairingTotalMrp - pairingTotalPrice) / pairingTotalMrp) * 100);

  const handleAddSingleItem = (item) => {
    const chosenSize = selectedSizes[item.id] || item.size || 'M';
    addToBag({
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      finalPrice: item.price,
      mrp: item.mrp,
      images: [item.image]
    }, chosenSize, 1);

    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleAddFullLook = () => {
    // 1. Add current main product
    const mainProductSize = product.sizes?.[0] || 'M';
    addToBag(product, mainProductSize, 1);

    // 2. Add all outfit pairing items
    outfitItems.forEach((item) => {
      const chosenSize = selectedSizes[item.id] || item.size || 'M';
      addToBag({
        id: item.id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        finalPrice: item.price,
        mrp: item.mrp,
        images: [item.image]
      }, chosenSize, 1);
    });

    setIsFullLookAdded(true);
    showToast(`Full ${outfitItems.length + 1}-Piece Outfit added to Bag!`);
    setTimeout(() => setIsFullLookAdded(false), 2500);
  };

  return (
    <div id="outfit-pairing-section" className="bg-white mt-2 border-t border-b border-[#EAEAEC] p-3 select-none">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#FFF0F3] text-[#FF3F6C] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#282C3F] uppercase tracking-wide">
              Complete The Look
            </h3>
            <p className="text-[10px] text-[#535766]">
              AI Curated Style & Color Synergy
            </p>
          </div>
        </div>

        {/* 98% Style Match Badge */}
        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#E6F9F5] to-[#D5F5EE] border border-[#03A685]/40 text-[#047857] text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-2xs">
          <ShieldCheck className="w-3 h-3 text-[#03A685] stroke-[2.5]" />
          <span>98% Style Match</span>
        </span>
      </div>

      {/* Styled Items Horizontal Cards List */}
      <div className="space-y-2.5">
        {outfitItems.map((item) => {
          const isAdded = !!addedItems[item.id];
          const currentSize = selectedSizes[item.id] || item.size;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 bg-[#FAFAFB] border border-[#EAEAEC] rounded-xl group hover:border-[#FF3F6C]/40 transition-all"
            >
              {/* Product Thumbnail */}
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-18 object-cover object-top rounded-lg border border-[#EAEAEC] flex-shrink-0"
              />

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-black text-[#282C3F] block truncate uppercase">
                  {item.brand}
                </span>
                <span className="text-[10.5px] text-[#535766] block truncate leading-tight mt-0.5">
                  {item.name}
                </span>

                {/* Price Row */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-black text-[#282C3F]">₹{item.price}</span>
                  <span className="text-[10px] text-[#94969F] line-through">₹{item.mrp}</span>
                </div>

                {/* Trust Badge */}
                <span className="inline-flex items-center gap-0.5 bg-[#E6F9F5] text-[#047857] text-[8.5px] font-bold px-1.5 py-0.5 rounded mt-1 border border-[#03A685]/20">
                  <ShieldCheck className="w-2.5 h-2.5 text-[#03A685]" />
                  <span>{item.badge}</span>
                </span>
              </div>

              {/* Quick Add Button */}
              <button
                type="button"
                onClick={() => handleAddSingleItem(item)}
                className={`px-3 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all active:scale-95 cursor-pointer flex-shrink-0 ${
                  isAdded
                    ? 'bg-[#03A685] text-white'
                    : 'bg-white border border-[#FF3F6C] text-[#FF3F6C] hover:bg-[#FFF0F3]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3" />
                    <span>+ Add</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 1-Tap Combo CTA Button */}
      <div className="mt-3 pt-3 border-t border-[#F5F5F6] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#535766] block">
            Bundle Price ({outfitItems.length + 1} Items):
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-[#282C3F]">
              ₹{product.finalPrice + pairingTotalPrice}
            </span>
            <span className="text-[10px] text-[#03A685] font-bold">
              Save {bundleDiscountPercent}%
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddFullLook}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98] cursor-pointer ${
            isFullLookAdded
              ? 'bg-[#03A685] text-white'
              : 'bg-gradient-to-r from-[#FF3F6C] to-[#FF557E] hover:from-[#E0355E] hover:to-[#E0456E] text-white shadow-[#FF3F6C]/25'
          }`}
        >
          {isFullLookAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Full Look In Bag!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add Full Look to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
