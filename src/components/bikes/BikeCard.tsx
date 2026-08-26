import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  Gauge,
  Fuel,
  Sparkles,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Bike } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface BikeCardProps {
  bike: Bike;
  onBookNow?: (bike: Bike) => void;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, onBookNow }) => {
  const navigate = useNavigate();
  const { selectBike } = useBooking();

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    selectBike(bike);
    if (onBookNow) {
      onBookNow(bike);
    } else {
      navigate(`/bikes/${bike.id}`);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cruiser':
        return 'Cruiser';
      case 'sports':
        return 'Sports';
      case 'adventure':
        return 'Adventure';
      case 'scooter':
        return 'Scooter';
      case 'electric_scooter':
        return 'Electric Scooter';
      case 'electric_bike':
        return 'Electric Bike';
      case 'commuter':
        return 'Commuter';
      default:
        return category;
    }
  };

  return (
    <div className="group bg-[#161B22] rounded-[28px] border border-white/10 hover:border-amber-500/50 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Bike Image Container */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={bike.images[0]}
          alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-black/40 pointer-events-none" />

        {/* Badges on Top */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant="amber" size="sm" className="font-bold shadow-xs">
            {getCategoryLabel(bike.category)}
          </Badge>
          {bike.tag && (
            <span className="bg-black/80 backdrop-blur-xs text-white border border-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {bike.tag}
            </span>
          )}
        </div>

        {/* Price Tag on Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-[#F59E0B] text-black font-black px-3 py-1 rounded-lg text-xs sm:text-sm shadow-xl flex items-center gap-0.5">
            <span>₹{bike.pricePerDay}</span>
            <span className="text-[10px] font-bold text-black/80">/day</span>
          </div>
        </div>

        {/* Location & Availability on bottom of image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-medium z-10">
          <div className="flex items-center gap-1 text-slate-200 text-[11px] truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{bike.locationName}</span>
          </div>
          <div className="flex items-center gap-1">
            {bike.available ? (
              <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                AVAILABLE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                BOOKED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bike Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model */}
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                {bike.brand}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{bike.rating.toFixed(1)}</span>
                <span className="text-slate-500 text-[10px]">({bike.reviewCount})</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors mt-0.5">
              <Link to={`/bikes/${bike.id}`}>{bike.name}</Link>
            </h3>
            <p className="text-slate-400 text-xs font-medium mt-0.5">
              {getCategoryLabel(bike.category)} • ₹{bike.securityDeposit} Refundable Deposit
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5">Engine / Power</div>
              <div className="text-xs font-bold text-white truncate">
                {bike.fuelType === 'Electric' ? 'EV Powertrain' : `${bike.engineCC}cc`}
              </div>
            </div>
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5">Gearbox</div>
              <div className="text-xs font-bold text-white truncate">{bike.transmission}</div>
            </div>
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5">Mileage</div>
              <div className="text-xs font-bold text-white truncate">{bike.mileage}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/bikes/${bike.id}`}
              className="w-full inline-flex items-center justify-center text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-amber-500/80 text-amber-400 hover:bg-[#F59E0B] hover:text-black transition-all text-center"
            >
              View Details
            </Link>

            <button
              onClick={handleBookNow}
              disabled={!bike.available}
              className={`w-full inline-flex items-center justify-center gap-1 text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-md ${
                bike.available
                  ? 'bg-[#F59E0B] hover:bg-amber-400 text-black shadow-amber-500/20 active:scale-95'
                  : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              <span>{bike.available ? 'Book Now' : 'Unavailable'}</span>
              {bike.available && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
