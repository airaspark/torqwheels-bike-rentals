import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { PaymentSelector } from '../components/booking/PaymentSelector';
import { PriceBreakdown } from '../components/booking/PriceBreakdown';
import { Button } from '../components/common/Button';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    draft,
    pricing,
    selectedPaymentMethod,
    setPaymentMethod,
    createFinalBooking,
    isSubmitting,
  } = useBooking();

  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (!draft.bike) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Active Booking Session</h2>
        <p className="text-xs text-slate-500">Please choose a motorcycle to start booking.</p>
        <Link to="/bikes" className="inline-block text-xs font-bold text-amber-600 hover:underline">
          ← Browse Fleet
        </Link>
      </div>
    );
  }

  const handleConfirmAndPay = async () => {
    if (!termsAccepted) {
      setErrorMsg('Please accept the rental terms and traffic safety agreement.');
      return;
    }
    setErrorMsg('');

    try {
      const confirmedBooking = await createFinalBooking(currentUser?.id);
      if (confirmedBooking) {
        navigate('/booking-confirmation', { state: { booking: confirmedBooking } });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete booking. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Final Verification & Settlement
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
          Review & Confirm Booking
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary & Payment Options */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Trip Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Trip & Rider Summary</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Bike details */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <img
                  src={draft.bike.images[0]}
                  alt={draft.bike.name}
                  className="w-16 h-14 object-cover rounded-xl shrink-0 bg-slate-950"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-600">{draft.bike.brand}</span>
                  <p className="font-bold text-slate-900 text-sm truncate">{draft.bike.name}</p>
                  <p className="text-slate-500 text-[11px]">₹{draft.bike.pricePerDay}/day • {draft.bike.fuelType}</p>
                </div>
              </div>

              {/* Rider info */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Rider Contact</span>
                <p className="font-bold text-slate-900 text-sm">{draft.customerName}</p>
                <p className="text-slate-600 text-[11px]">{draft.customerPhone} • {draft.customerEmail}</p>
                <p className="text-amber-800 font-mono text-[10px] font-bold">DL: {draft.drivingLicenceNumber}</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-1">
                  Pickup Schedule
                </span>
                <p className="font-bold text-slate-900">{draft.pickupDate} at {draft.pickupTime}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{draft.pickupLocationName}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase text-amber-600 block mb-1">
                  Dropoff Schedule
                </span>
                <p className="font-bold text-slate-900">{draft.returnDate} at {draft.returnTime}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{draft.returnLocationName}</p>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <PaymentSelector
            selectedMethod={selectedPaymentMethod}
            onSelect={setPaymentMethod}
            totalAmount={pricing.totalAmount}
          />

          {/* Terms & Conditions Checkbox */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                I agree to the <strong>TorqWheels Rental Agreement</strong>, wear a certified helmet at all times, carry my valid driving licence during rides, and acknowledge the refundable deposit policy.
              </span>
            </label>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Pay CTA */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-24">
          <PriceBreakdown
            pricePerDay={draft.bike.pricePerDay}
            securityDeposit={draft.bike.securityDeposit}
            durationDays={pricing.durationDays}
            addons={draft.addons}
            pricing={pricing}
          />

          <div className="space-y-3">
            <Button
              onClick={handleConfirmAndPay}
              isLoading={isSubmitting}
              variant="primary"
              size="lg"
              className="w-full shadow-xl shadow-amber-500/25 font-black text-sm"
              leftIcon={<Lock className="w-4 h-4" />}
            >
              {selectedPaymentMethod === 'Cash on Pickup'
                ? `Confirm Booking (Pay ₹${pricing.totalAmount} on Pickup)`
                : `Authorize & Pay ₹${pricing.totalAmount}`}
            </Button>

            <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Confirmation with SMS & WhatsApp Slip</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
