import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Shield,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Bike as BikeIcon,
  Tag,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { BikeService } from '../services/bike.service';
import { Bike, BookingAddons } from '../types';
import { Button } from '../components/common/Button';
import { PriceBreakdown } from '../components/booking/PriceBreakdown';

export const BookingFlowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    draft,
    updateDraft,
    selectBike,
    toggleAddon,
    applyCoupon,
    pricing,
    locations,
  } = useBooking();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id && (!draft.bike || draft.bike.id !== id)) {
      BikeService.getBikeById(id).then((b) => {
        if (b) selectBike(b);
      });
    }

    // Auto-fill user info if logged in
    if (currentUser) {
      updateDraft({
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone,
        drivingLicenceNumber: currentUser.drivingLicenceNumber || draft.drivingLicenceNumber,
      });
    }
  }, [id, currentUser]);

  if (!draft.bike) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">No Bike Selected</h2>
        <p className="text-xs text-slate-500 mt-2">Please select a bike from our fleet first to start your booking.</p>
        <Link to="/bikes" className="mt-4 inline-block text-amber-600 font-bold text-xs hover:underline">
          ← View All Fleet
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!draft.customerName || !draft.customerPhone || !draft.drivingLicenceNumber) {
        alert('Please fill in your Name, Phone Number, and Driving Licence Number.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Progress Steps Indicator */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
          {[
            { num: 1, label: 'Trip & Hub' },
            { num: 2, label: 'Rider Info' },
            { num: 3, label: 'Gear & Addons' },
          ].map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 font-black'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 ${
                    isCurrent ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Area */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* STEP 1: Trip & Hub Schedule */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-black text-slate-950">Rental Schedule & Stations</h3>
                <p className="text-xs text-slate-500">
                  Select your pickup hub and dates for <strong>{draft.bike.name}</strong>.
                </p>
              </div>

              {/* Hub Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Pickup Hub
                  </label>
                  <select
                    value={draft.pickupLocationId}
                    onChange={(e) => updateDraft({ pickupLocationId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city} - {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Dropoff Hub
                  </label>
                  <select
                    value={draft.returnLocationId}
                    onChange={(e) => updateDraft({ returnLocationId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city} - {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates & Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pickup Date & Time</span>
                  </span>
                  <input
                    type="date"
                    value={draft.pickupDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateDraft({ pickupDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                  <select
                    value={draft.pickupTime}
                    onChange={(e) => updateDraft({ pickupTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    {['06:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dropoff Date & Time</span>
                  </span>
                  <input
                    type="date"
                    value={draft.returnDate}
                    min={draft.pickupDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateDraft({ returnDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                  <select
                    value={draft.returnTime}
                    onChange={(e) => updateDraft({ returnTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Rider Information (Section 14) */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-black text-slate-950">Rider & Licence Information</h3>
                <p className="text-xs text-slate-500">
                  Required for insurance coverage and vehicle handover verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Full Name (As per DL) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Deshmukh"
                    value={draft.customerName}
                    onChange={(e) => updateDraft({ customerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 12345"
                    value={draft.customerPhone}
                    onChange={(e) => updateDraft({ customerPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="youremail@domain.com"
                    value={draft.customerEmail}
                    onChange={(e) => updateDraft({ customerEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Driving Licence (DL) Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="KA-01-2021-0089241"
                    value={draft.drivingLicenceNumber}
                    onChange={(e) => updateDraft({ drivingLicenceNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Zero-Upload Friction:</strong> In accordance with prototype requirements, you only need to enter your licence number. You will simply present your original physical DL at the pickup counter for quick visual verification.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Optional Addons */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-black text-slate-950">Addons & Riding Accessories</h3>
                <p className="text-xs text-slate-500">
                  Select optional gear to elevate your touring comfort and safety.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'extraHelmet' as keyof BookingAddons,
                    title: 'Pillion Rider ISI Helmet',
                    desc: 'Primary rider helmet is already free. Add a sanitized second helmet.',
                    price: '₹50 / day',
                  },
                  {
                    key: 'ridingJacket' as keyof BookingAddons,
                    title: 'All-Weather Armored Riding Jacket',
                    desc: 'CE-certified shoulder and elbow armor with breathable mesh liner.',
                    price: '₹150 / day',
                  },
                  {
                    key: 'phoneMount' as keyof BookingAddons,
                    title: 'Vibration-Dampened Mobile Handlebar Mount',
                    desc: 'Secure claw grip with USB fast-charging tether.',
                    price: '₹30 / day',
                  },
                  {
                    key: 'luggageCarrier' as keyof BookingAddons,
                    title: 'Rear Tail Luggage Carrier & Bungees',
                    desc: 'Sturdy steel rack ready for backpacks and touring duffels.',
                    price: '₹100 / day',
                  },
                  {
                    key: 'insuranceCover' as keyof BookingAddons,
                    title: 'Zero-Liability Comprehensive Trip Shield',
                    desc: 'Covers accidental damage up to ₹50,000 + 24/7 towing assistance.',
                    price: '₹99 flat',
                  },
                ].map((addon) => {
                  const isChecked = draft.addons[addon.key];
                  return (
                    <label
                      key={addon.key}
                      className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddon(addon.key)}
                          className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{addon.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{addon.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shrink-0">
                        {addon.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls inside Card */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <Button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous Step
              </Button>
            ) : (
              <Link
                to={`/bikes/${draft.bike.id}`}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                ← Back to Bike Details
              </Link>
            )}

            <Button
              type="button"
              onClick={handleNext}
              variant="primary"
              size="md"
              className="shadow-md shadow-amber-500/20 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {step === 3 ? 'Proceed to Final Checkout' : 'Next Step'}
            </Button>
          </div>
        </div>

        {/* Right Summary Area */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Selected Bike Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
            <img
              src={draft.bike.images[0]}
              alt={draft.bike.name}
              className="w-24 h-20 object-cover rounded-2xl bg-slate-950 border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">
                {draft.bike.brand}
              </span>
              <h4 className="font-bold text-slate-900 text-sm truncate">{draft.bike.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">₹{draft.bike.pricePerDay} / day</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <PriceBreakdown
            pricePerDay={draft.bike.pricePerDay}
            securityDeposit={draft.bike.securityDeposit}
            durationDays={pricing.durationDays}
            addons={draft.addons}
            couponCode={draft.couponCode}
            onApplyCoupon={applyCoupon}
            pricing={pricing}
          />
        </div>
      </div>
    </div>
  );
};
