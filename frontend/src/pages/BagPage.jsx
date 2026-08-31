import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProductImageUrl } from '../utils/imageHelper';
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Heart,
  ShieldCheck,
  Tag,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Sparkles,
  Truck,
  RotateCcw,
  ArrowRight,
  X
} from 'lucide-react';

export default function BagPage() {
  const navigate = useNavigate();
  const {
    bag,
    bagCount,
    bagTotals,
    removeFromBag,
    updateBagQuantity,
    updateBagSize,
    moveToWishlistFromBag,
    clearBag,
    showToast
  } = useApp();

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('MYN-782914');
  const [sizeModalItem, setSizeModalItem] = useState(null);
  const [qtyModalItem, setQtyModalItem] = useState(null);

  const availableCoupons = [
    { code: 'MYNTRA200', discount: 200, minAmount: 999, desc: 'Flat ₹200 OFF on orders above ₹999' },
    { code: 'TRUSTFEST', discount: 150, minAmount: 799, desc: 'Special Trust-Verified discount of ₹150' },
    { code: 'FIRSTBUY', discount: 300, minAmount: 1499, desc: 'Welcome bonus: ₹300 OFF on first purchase' }
  ];

  const handleApplyCoupon = (coupon) => {
    if (bagTotals.totalFinalPrice < coupon.minAmount) {
      showToast(`Minimum order value of ₹${coupon.minAmount} required for this coupon`);
      return;
    }
    setAppliedCoupon(coupon);
    setIsCouponModalOpen(false);
    showToast(`Coupon ${coupon.code} applied! Saved ₹${coupon.discount}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const finalPayable = Math.max(
    0,
    bagTotals.finalAmount - (appliedCoupon ? appliedCoupon.discount : 0)
  );

  const handlePlaceOrder = () => {
    const randomId = `MYN-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderId(randomId);
    setIsOrderPlaced(true);
    clearBag();
  };

  if (isOrderPlaced) {
    return (
      <div className="flex-1 flex flex-col bg-white p-6 items-center justify-center text-center select-none animate-fade-in">
        <div className="w-20 h-20 bg-[#E8F8F5] rounded-full flex items-center justify-center text-[#14958F] mb-4 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <span className="text-[11px] font-black text-[#14958F] uppercase tracking-wider bg-[#E8F8F5] px-3 py-1 rounded-full mb-2">
          Order Confirmed
        </span>
        <h2 className="text-xl font-black text-[#282C3F]">Thank You for Your Order!</h2>
        <p className="text-xs text-[#535766] mt-2 max-w-[280px]">
          Your trust-verified order <strong className="text-[#282C3F]">#{placedOrderId}</strong> has been placed and is being packed.
        </p>

        <div className="w-full bg-[#F5F5F6] border border-[#EAEAEC] rounded-xl p-4 my-6 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#535766]">Estimated Delivery</span>
            <span className="font-bold text-[#282C3F]">Tomorrow by 11:00 AM</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#535766]">Delivery Address</span>
            <span className="font-bold text-[#282C3F] truncate max-w-[160px]">Prestige Towers, Bengaluru</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#535766]">Total Paid</span>
            <span className="font-black text-[#282C3F]">₹{finalPayable}</span>
          </div>
          <div className="pt-2 border-t border-[#EAEAEC] flex items-center gap-1.5 text-[11px] font-bold text-[#14958F]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Quality & Authenticity Guarantee</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsOrderPlaced(false);
            navigate('/');
          }}
          className="w-full py-3.5 bg-[#FF3F6C] hover:bg-[#E72744] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F6] pb-24 select-none min-h-screen">
      
      {/* 1. TOP HEADER BAR */}
      <div className="bg-white px-3 py-2.5 border-b border-[#EAEAEC] sticky top-0 z-30 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="text-[#282C3F] hover:text-[#FF3F6C] p-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xs font-black text-[#282C3F] uppercase tracking-wide flex items-center gap-1.5">
              <span>Shopping Bag</span>
              <span className="text-[#FF3F6C]">({bagCount} {bagCount === 1 ? 'item' : 'items'})</span>
            </h1>
          </div>
        </div>

        {/* Step Indicator (1/3 Bag -> Address -> Payment) */}
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#14958F] bg-[#E8F8F5] px-2 py-0.5 rounded-full border border-[#14958F]/20">
          <ShieldCheck className="w-3 h-3" />
          <span>100% Secure</span>
        </div>
      </div>

      {/* 2. DELIVERY ADDRESS STRIP */}
      <div className="bg-[#FFF8F9] px-3 py-2 border-b border-[#FF3F6C]/15 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[#FF3F6C] flex-shrink-0" />
          <span className="text-[11px] text-[#282C3F] truncate font-medium">
            Deliver to: <strong className="font-bold text-[#282C3F]">Prestige Towers, 560034</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => showToast('Default delivery address selected')}
          className="text-[10px] font-black text-[#FF3F6C] border border-[#FF3F6C]/40 hover:bg-[#FFF0F3] px-2 py-0.5 rounded uppercase tracking-wider cursor-pointer"
        >
          Change
        </button>
      </div>

      {/* 3. BAG CONTENT OR EMPTY STATE */}
      {bag.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-3 rounded-2xl border border-[#EAEAEC] shadow-2xs">
          <div className="w-20 h-20 rounded-full bg-[#FFF0F3] text-[#FF3F6C] flex items-center justify-center mb-3">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-sm font-black text-[#282C3F]">Hey, your bag is empty!</h2>
          <p className="text-xs text-[#535766] mt-1 max-w-[240px]">
            There are no items in your shopping bag. Explore products or add directly from your saved wishlist!
          </p>
          
          <div className="mt-5 flex flex-col gap-2.5 w-full max-w-[240px]">
            <button
              type="button"
              onClick={() => navigate('/wishlist')}
              className="w-full py-2.5 bg-[#FFF0F3] border border-[#FF3F6C] text-[#FF3F6C] font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#FFE3E9] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Add from Wishlist</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 bg-[#FF3F6C] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#E0355E] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 space-y-3">
          
          {/* Trust Guarantee Top Banner */}
          <div className="bg-white border border-[#EAEAEC] rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E8F8F5] text-[#14958F] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-black text-[#282C3F]">Trust-Verified Items</p>
                <p className="text-[10px] text-[#535766]">All items pass authenticity & quality verification</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-[#14958F] bg-[#E8F8F5] px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          {/* ITEM LIST */}
          <div className="space-y-2.5">
            {bag.map((item) => {
              const p = item.product;
              const mainImage = getProductImageUrl(p.images?.[0], p.category, 1);

              // Find top positive trust stat if available
              let trustStat = null;
              if (p.badgeAggregates) {
                for (const [, agg] of Object.entries(p.badgeAggregates)) {
                  if (!agg.belowThreshold && agg.percentPositive >= 70) {
                    trustStat = `${agg.percentPositive}% ${agg.displayLabel}`;
                    break;
                  }
                }
              }

              return (
                <div
                  key={`${item.product.id}_${item.size}`}
                  className="bg-white border border-[#EAEAEC] rounded-xl overflow-hidden shadow-2xs p-3 relative"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail Image */}
                    <div
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="w-20 h-26 bg-[#F5F5F6] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer relative"
                    >
                      <img
                        src={mainImage}
                        alt={p.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Item Information */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Brand & Title */}
                        <div className="flex items-start justify-between gap-1">
                          <h3
                            onClick={() => navigate(`/product/${p.id}`)}
                            className="text-xs font-black text-[#282C3F] uppercase tracking-wide truncate cursor-pointer hover:text-[#FF3F6C]"
                          >
                            {p.brand}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeFromBag(p.id, item.size)}
                            aria-label="Remove item"
                            className="text-[#94969F] hover:text-[#D5284F] p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#535766] truncate font-normal mt-0.5">
                          {p.name}
                        </p>

                        {/* Size & Quantity Selectors */}
                        <div className="flex items-center gap-2 mt-2">
                          {/* Size Pill */}
                          <button
                            type="button"
                            onClick={() => setSizeModalItem(item)}
                            className="flex items-center gap-1 bg-[#F5F5F6] border border-[#D4D5D9] hover:border-[#FF3F6C] px-2 py-0.5 rounded text-[11px] font-black text-[#282C3F] cursor-pointer"
                          >
                            <span>Size: <strong>{item.size}</strong></span>
                            <ChevronDown className="w-3 h-3 text-[#535766]" />
                          </button>

                          {/* Qty Pill */}
                          <button
                            type="button"
                            onClick={() => setQtyModalItem(item)}
                            className="flex items-center gap-1 bg-[#F5F5F6] border border-[#D4D5D9] hover:border-[#FF3F6C] px-2 py-0.5 rounded text-[11px] font-black text-[#282C3F] cursor-pointer"
                          >
                            <span>Qty: <strong>{item.quantity || 1}</strong></span>
                            <ChevronDown className="w-3 h-3 text-[#535766]" />
                          </button>
                        </div>

                        {/* Price Details */}
                        <div className="flex items-baseline gap-1.5 mt-2">
                          <span className="text-xs font-black text-[#282C3F]">
                            ₹{p.finalPrice * (item.quantity || 1)}
                          </span>
                          {p.mrp > p.finalPrice && (
                            <span className="text-[10px] text-[#94969F] line-through">
                              ₹{p.mrp * (item.quantity || 1)}
                            </span>
                          )}
                          {p.discountPercent > 0 && (
                            <span className="text-[10px] font-bold text-[#03A685]">
                              {p.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Trust Signal Verification Pill */}
                      {trustStat && (
                        <div className="mt-2 bg-[#E8F8F5] border border-[#14958F]/25 px-2 py-0.5 rounded text-[9px] font-bold text-[#14958F] flex items-center gap-1 self-start">
                          <ShieldCheck className="w-2.5 h-2.5 text-[#14958F] flex-shrink-0" />
                          <span>{trustStat}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Footer: Move to Wishlist & Delivery */}
                  <div className="mt-2.5 pt-2 border-t border-[#F5F5F6] flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 text-[#535766]">
                      <Truck className="w-3 h-3 text-[#03A685]" />
                      <span>Delivery by <strong className="text-[#282C3F]">Tomorrow</strong></span>
                    </div>

                    <button
                      type="button"
                      onClick={() => moveToWishlistFromBag(p, item.size)}
                      className="text-[#FF3F6C] hover:text-[#E72744] font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      <Heart className="w-3 h-3" />
                      <span>Move to Wishlist</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. COUPONS SECTION */}
          <div className="bg-white border border-[#EAEAEC] rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#282C3F] uppercase tracking-wide">
                <Tag className="w-3.5 h-3.5 text-[#FF3F6C]" />
                <span>Coupons & Offers</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(true)}
                className="text-[11px] font-bold text-[#FF3F6C] hover:underline cursor-pointer"
              >
                {appliedCoupon ? 'Change' : 'Apply'}
              </button>
            </div>

            {appliedCoupon ? (
              <div className="bg-[#E8F8F5] border border-[#14958F]/30 rounded-lg p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14958F]" />
                  <div>
                    <span className="text-xs font-black text-[#14958F]">
                      '{appliedCoupon.code}' APPLIED
                    </span>
                    <p className="text-[10px] text-[#535766]">You saved ₹{appliedCoupon.discount}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-[#D5284F] hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsCouponModalOpen(true)}
                className="bg-[#FFF8F9] border border-dashed border-[#FF3F6C]/40 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-[#FFF0F3]"
              >
                <div className="flex items-center gap-1.5 text-xs text-[#282C3F] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF3F6C]" />
                  <span>Apply coupon to save up to ₹300</span>
                </div>
                <span className="text-xs font-black text-[#FF3F6C]">&gt;</span>
              </div>
            )}
          </div>

          {/* 5. PRICE DETAILS BREAKDOWN */}
          <div className="bg-white border border-[#EAEAEC] rounded-xl p-3.5 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-black text-[#282C3F] uppercase tracking-wider border-b border-[#F5F5F6] pb-2">
              Price Details ({bagCount} {bagCount === 1 ? 'Item' : 'Items'})
            </h3>

            <div className="space-y-1.5 text-xs text-[#535766]">
              <div className="flex items-center justify-between">
                <span>Total MRP</span>
                <span>₹{bagTotals.totalMrp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount on MRP</span>
                <span className="text-[#03A685] font-bold">-₹{bagTotals.totalDiscount}</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="text-[#03A685] font-bold">-₹{appliedCoupon.discount}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Convenience / Platform Fee</span>
                <span className="text-[#282C3F] font-semibold">₹{bagTotals.platformFee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping Fee</span>
                <span className="text-[#03A685] font-bold">FREE</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#EAEAEC] flex items-center justify-between text-xs font-black text-[#282C3F]">
              <span>Total Amount</span>
              <span className="text-sm text-[#282C3F]">₹{finalPayable}</span>
            </div>
          </div>

          {/* 6. TRUST & SAFETY BADGES */}
          <div className="grid grid-cols-3 gap-2 py-2 text-center text-[#535766]">
            <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg border border-[#EAEAEC]">
              <ShieldCheck className="w-4 h-4 text-[#14958F]" />
              <span className="text-[9px] font-bold">100% Original</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg border border-[#EAEAEC]">
              <RotateCcw className="w-4 h-4 text-[#FF3F6C]" />
              <span className="text-[9px] font-bold">14 Days Return</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg border border-[#EAEAEC]">
              <Truck className="w-4 h-4 text-[#03A685]" />
              <span className="text-[9px] font-bold">Fast Express</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. STICKY PLACE ORDER CHECKOUT BAR */}
      {bag.length > 0 && (
        <div className="sticky bottom-14 z-30 bg-white border-t border-[#EAEAEC] px-4 py-3 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
          <div>
            <span className="text-[10px] text-[#94969F] font-bold block leading-none">
              TOTAL PAYABLE
            </span>
            <span className="text-base font-black text-[#282C3F] leading-tight">
              ₹{finalPayable}
            </span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            className="py-3 px-8 bg-[#FF3F6C] hover:bg-[#E72744] active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#FF3F6C]/30 transition-all cursor-pointer"
          >
            Place Order
          </button>
        </div>
      )}

      {/* SIZE SELECTOR MODAL */}
      {sizeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-4 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEC]">
              <h3 className="text-xs font-black text-[#282C3F] uppercase tracking-wide">
                Select Size
              </h3>
              <button
                type="button"
                onClick={() => setSizeModalItem(null)}
                className="text-[#94969F] hover:text-[#282C3F] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 my-4">
              {(sizeModalItem.product.sizes || ['S', 'M', 'L', 'XL']).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => {
                    updateBagSize(sizeModalItem.product.id, sizeModalItem.size, sz);
                    setSizeModalItem(null);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    sizeModalItem.size === sz
                      ? 'border-[#FF3F6C] bg-[#FFF0F3] text-[#FF3F6C]'
                      : 'border-[#D4D5D9] text-[#282C3F] hover:border-[#FF3F6C]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUANTITY SELECTOR MODAL */}
      {qtyModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-4 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEC]">
              <h3 className="text-xs font-black text-[#282C3F] uppercase tracking-wide">
                Select Quantity
              </h3>
              <button
                type="button"
                onClick={() => setQtyModalItem(null)}
                className="text-[#94969F] hover:text-[#282C3F] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 my-4">
              {[1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    updateBagQuantity(qtyModalItem.product.id, qtyModalItem.size, q);
                    setQtyModalItem(null);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    (qtyModalItem.quantity || 1) === q
                      ? 'border-[#FF3F6C] bg-[#FFF0F3] text-[#FF3F6C]'
                      : 'border-[#D4D5D9] text-[#282C3F] hover:border-[#FF3F6C]'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COUPONS MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-4 animate-slide-up shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEC]">
              <h3 className="text-xs font-black text-[#282C3F] uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#FF3F6C]" />
                <span>Apply Coupon</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="text-[#94969F] hover:text-[#282C3F] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Code Input */}
            <div className="flex items-center gap-2 my-3">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 border border-[#D4D5D9] rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#FF3F6C]"
              />
              <button
                type="button"
                onClick={() => {
                  const found = availableCoupons.find((c) => c.code === couponInput);
                  if (found) {
                    handleApplyCoupon(found);
                  } else {
                    showToast('Invalid coupon code');
                  }
                }}
                className="px-4 py-2 bg-[#FF3F6C] text-white font-black text-xs uppercase rounded-xl"
              >
                Check
              </button>
            </div>

            {/* Coupons List */}
            <div className="space-y-2.5 mt-4">
              <span className="text-[11px] font-bold text-[#535766] uppercase tracking-wider">
                Available Coupons
              </span>
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="border border-[#EAEAEC] rounded-xl p-3 hover:border-[#FF3F6C] transition-all bg-[#FAFAFB]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#FF3F6C] bg-[#FFF0F3] border border-[#FF3F6C]/30 px-2 py-0.5 rounded">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(coupon)}
                      className="text-xs font-black text-[#FF3F6C] hover:underline cursor-pointer"
                    >
                      APPLY
                    </button>
                  </div>
                  <p className="text-xs font-bold text-[#282C3F] mt-1.5">
                    Save ₹{coupon.discount}
                  </p>
                  <p className="text-[10px] text-[#535766] mt-0.5">
                    {coupon.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
