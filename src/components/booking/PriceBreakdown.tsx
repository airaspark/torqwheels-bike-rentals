import React, { useState } from 'react';
import { Tag, ShieldCheck, Info } from 'lucide-react';
import { BookingAddons } from '../../types';
import { Button } from '../common/Button';

interface PriceBreakdownProps {
  pricePerDay: number;
  securityDeposit: number;
  durationDays: number;
  addons: BookingAddons;
  couponCode?: string;
  onApplyCoupon?: (code: string) => void;
  pricing: {
    rentalAmount: number;
    securityDeposit: number;
    addonsAmount: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
  };
  className?: string;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  pricePerDay,
  securityDeposit,
  durationDays,
  addons,
  couponCode = '',
  onApplyCoupon,
  pricing,
  className = '',
}) => {
  const [inputCoupon, setInputCoupon] = useState(couponCode);
  const [couponAppliedMessage, setCouponAppliedMessage] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    if (onApplyCoupon) {
      onApplyCoupon(inputCoupon.trim());
      if (['FREEDOMRIDE', 'ADVENTURE500', 'FIRST100'].includes(inputCoupon.toUpperCase().trim())) {
        setCouponAppliedMessage(`✓ Coupon applied successfully!`);
      } else {
        setCouponAppliedMessage('⚠ Coupon code not recognized.');
      }
    }
  };

  return (
    <div className={`bg-slate-50/80 rounded-2xl border border-slate-200/90 p-5 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h4 className="font-bold text-slate-900 text-sm">Fare Breakdown</h4>
        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
          {durationDays} {durationDays === 1 ? 'Day' : 'Days'} Duration
        </span>
      </div>

      {/* Itemized list */}
      <div className="space-y-2.5 text-xs">
        {/* Base Rental */}
        <div className="flex items-center justify-between text-slate-700">
          <span>
            Rental Fee (₹{pricePerDay} × {durationDays} {durationDays === 1 ? 'day' : 'days'})
          </span>
          <span className="font-semibold text-slate-900">₹{pricing.rentalAmount}</span>
        </div>

        {/* Security Deposit (Refundable) */}
        <div className="flex items-center justify-between text-slate-700">
          <span className="flex items-center gap-1">
            <span>Refundable Security Deposit</span>
            <span className="text-[10px] text-emerald-600 font-bold">(100% Refundable)</span>
          </span>
          <span className="font-semibold text-slate-900">₹{pricing.securityDeposit}</span>
        </div>

        {/* Addons if any */}
        {pricing.addonsAmount > 0 && (
          <div className="flex items-center justify-between text-slate-700">
            <span>Selected Gear & Insurance Addons</span>
            <span className="font-semibold text-slate-900">+₹{pricing.addonsAmount}</span>
          </div>
        )}

        {/* GST 18% */}
        <div className="flex items-center justify-between text-slate-700">
          <span>Applicable GST (18%)</span>
          <span className="font-semibold text-slate-900">+₹{pricing.taxAmount}</span>
        </div>

        {/* Discount if coupon */}
        {pricing.discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-200">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Promo Discount ({couponCode?.toUpperCase()})</span>
            </span>
            <span>-₹{pricing.discountAmount}</span>
          </div>
        )}
      </div>

      {/* Promo Coupon Form */}
      {onApplyCoupon && (
        <form onSubmit={handleApplyCoupon} className="pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Coupon Code (e.g. FREEDOMRIDE)"
              value={inputCoupon}
              onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs uppercase font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 uppercase tracking-wider"
            />
            <Button type="submit" variant="secondary" size="sm" className="text-xs">
              Apply
            </Button>
          </div>
          {couponAppliedMessage && (
            <p className="text-[11px] font-medium text-emerald-600 mt-1">
              {couponAppliedMessage}
            </p>
          )}
        </form>
      )}

      {/* Total Amount Box */}
      <div className="pt-3 border-t-2 border-dashed border-slate-300 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-slate-500 font-medium">Total Payable Amount</span>
          <p className="text-[10px] text-slate-500">(Includes refundable ₹{securityDeposit} deposit)</p>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1 text-slate-950">
            <span className="text-sm font-bold">₹</span>
            <span className="text-2xl font-black">{pricing.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
