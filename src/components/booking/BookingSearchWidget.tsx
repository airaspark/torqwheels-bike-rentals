import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../common/Button';

interface BookingSearchWidgetProps {
  className?: string;
  variant?: 'hero' | 'compact' | 'inline';
  onSearchComplete?: () => void;
}

export const BookingSearchWidget: React.FC<BookingSearchWidgetProps> = ({
  className = '',
  variant = 'hero',
  onSearchComplete,
}) => {
  const navigate = useNavigate();
  const { draft, updateDraft, locations, pricing } = useBooking();
  const [sameReturnLocation, setSameReturnLocation] = useState(
    draft.pickupLocationId === draft.returnLocationId
  );

  const timeOptions = [
    '06:00 AM',
    '07:00 AM',
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:00 PM',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchComplete) {
      onSearchComplete();
    } else {
      navigate('/bikes');
    }
  };

  const handlePickupLocationChange = (locId: string) => {
    updateDraft({
      pickupLocationId: locId,
      ...(sameReturnLocation ? { returnLocationId: locId } : {}),
    });
  };

  return (
    <div
      className={`bg-[#161B22] text-[#F8FAFC] rounded-2xl sm:rounded-[28px] p-6 sm:p-7 shadow-2xl border border-white/10 ${className}`}
    >
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Same location toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real-time Hub Availability</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={sameReturnLocation}
              onChange={(e) => {
                const checked = e.target.checked;
                setSameReturnLocation(checked);
                if (checked) {
                  updateDraft({ returnLocationId: draft.pickupLocationId });
                }
              }}
              className="rounded bg-[#0B0C11] border-white/20 text-[#F59E0B] focus:ring-amber-400 h-3.5 w-3.5"
            />
            <span className="font-medium text-xs text-slate-300">Return to same hub</span>
          </label>
        </div>

        {/* Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pickup Hub */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Pickup Location</span>
            </label>
            <div className="relative">
              <select
                value={draft.pickupLocationId}
                onChange={(e) => handlePickupLocationChange(e.target.value)}
                className="w-full bg-[#0B0C11] hover:bg-[#0e1017] border border-white/10 rounded-xl px-3.5 py-3 text-sm font-semibold text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-[#161B22] text-white">
                    {loc.city} - {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Return Hub */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Dropoff Location</span>
            </label>
            <div className="relative">
              <select
                disabled={sameReturnLocation}
                value={sameReturnLocation ? draft.pickupLocationId : draft.returnLocationId}
                onChange={(e) => updateDraft({ returnLocationId: e.target.value })}
                className={`w-full border rounded-xl px-3.5 py-3 text-sm font-semibold transition-all appearance-none cursor-pointer ${
                  sameReturnLocation
                    ? 'bg-black/30 text-slate-500 border-white/5 cursor-not-allowed'
                    : 'bg-[#0B0C11] hover:bg-[#0e1017] border-white/10 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                }`}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-[#161B22] text-white">
                    {loc.city} - {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pickup Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Pickup Date</span>
            </label>
            <input
              type="date"
              value={draft.pickupDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => updateDraft({ pickupDate: e.target.value })}
              className="w-full bg-[#0B0C11] hover:bg-[#0e1017] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Pickup Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Pickup Time</span>
            </label>
            <select
              value={draft.pickupTime}
              onChange={(e) => updateDraft({ pickupTime: e.target.value })}
              className="w-full bg-[#0B0C11] hover:bg-[#0e1017] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none cursor-pointer"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time} className="bg-[#161B22] text-white">
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Return Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Return Date</span>
            </label>
            <input
              type="date"
              value={draft.returnDate}
              min={draft.pickupDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => updateDraft({ returnDate: e.target.value })}
              className="w-full bg-[#0B0C11] hover:bg-[#0e1017] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Return Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Return Time</span>
            </label>
            <select
              value={draft.returnTime}
              onChange={(e) => updateDraft({ returnTime: e.target.value })}
              className="w-full bg-[#0B0C11] hover:bg-[#0e1017] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none cursor-pointer"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time} className="bg-[#161B22] text-white">
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer & Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="bg-amber-500/10 text-amber-400 font-bold px-2.5 py-1 rounded-lg border border-amber-500/20">
              {pricing.durationDays} {pricing.durationDays === 1 ? 'Day' : 'Days'} Total Rental
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 text-xs hidden sm:inline">
              Includes 250 km/day & 1 ISI Helmet
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-black font-bold py-3.5 px-8 rounded-xl shadow-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>Search Available Bikes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
