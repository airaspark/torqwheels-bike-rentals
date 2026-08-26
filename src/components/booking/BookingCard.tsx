import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { Booking } from '../../types';
import { BookingStatusBadge, PaymentStatusBadge } from './BookingStatusBadge';
import { Button } from '../common/Button';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const isUpcoming = booking.bookingStatus === 'Confirmed' || booking.bookingStatus === 'Ready for Pickup';
  const isActive = booking.bookingStatus === 'Active';
  const canCancel = isUpcoming || booking.bookingStatus === 'Pending';

  return (
    <div className="bg-[#161B22] rounded-2xl border border-white/10 hover:border-amber-500/40 p-5 sm:p-6 shadow-2xl transition-all space-y-4 text-[#F8FAFC]">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-mono font-black text-amber-400 text-sm tracking-wider bg-black/50 px-3 py-1 rounded-lg border border-white/10">
            {booking.bookingCode}
          </span>
          <BookingStatusBadge status={booking.bookingStatus} />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Payment:</span>
          <PaymentStatusBadge status={booking.paymentStatus} />
          <span className="text-slate-400 font-medium">({booking.paymentMethod})</span>
        </div>
      </div>

      {/* Main Bike & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Bike Image & Title */}
        <div className="md:col-span-5 flex items-center gap-3.5">
          <img
            src={booking.bikeImage}
            alt={booking.bikeName}
            className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-xl shrink-0 bg-black/60 border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">
              {booking.bikeBrand}
            </span>
            <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1">
              {booking.bikeName}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {booking.durationDays} {booking.durationDays === 1 ? 'Day' : 'Days'} • ₹{booking.pricePerDay}/day
            </p>
          </div>
        </div>

        {/* Schedule & Hubs */}
        <div className="md:col-span-4 space-y-2 text-xs text-slate-300 bg-[#0B0C11] p-3 rounded-xl border border-white/5">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold text-white truncate">{booking.pickupLocationName}</p>
              <p className="text-slate-400 text-[11px]">
                {booking.pickupDate} at {booking.pickupTime}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold text-white truncate">{booking.returnLocationName}</p>
              <p className="text-slate-400 text-[11px]">
                {booking.returnDate} at {booking.returnTime}
              </p>
            </div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="md:col-span-3 flex flex-row md:flex-col items-end md:items-end justify-between md:justify-center gap-2">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Total Fare
            </span>
            <span className="text-lg sm:text-xl font-black text-white">
              ₹{booking.totalAmount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/my-bookings/${booking.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#F59E0B] hover:bg-amber-400 text-black px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
