import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  ShieldCheck,
  Fuel,
  Gauge,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Share2,
  Heart,
  FileCheck,
  Zap,
} from 'lucide-react';
import { BikeService } from '../services/bike.service';
import { LocationService } from '../services/location.service';
import { Bike, LocationHub } from '../types';
import { useBooking } from '../context/BookingContext';
import { BikeGallery } from '../components/bikes/BikeGallery';
import { AvailabilityChecker } from '../components/booking/AvailabilityChecker';
import { PriceBreakdown } from '../components/booking/PriceBreakdown';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const BikeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { draft, updateDraft, selectBike, pricing, locations } = useBooking();

  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      setLoading(true);
      BikeService.getBikeById(id)
        .then((b) => {
          if (b) {
            setBike(b);
            selectBike(b);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleProceedToBooking = () => {
    if (!bike) return;
    selectBike(bike);
    navigate(`/booking/${bike.id}`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading motorcycle specifications & rates..." />;
  }

  if (!bike) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Bike Not Found</h2>
        <p className="text-slate-600 mt-2">The requested motorcycle could not be found in our fleet.</p>
        <Link to="/bikes" className="mt-4 inline-block text-amber-600 font-bold hover:underline">
          ← Return to Bike Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <Link to="/bikes" className="hover:text-amber-600">Bikes</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate">{bike.name}</span>
      </nav>

      {/* Main Grid: Gallery & Details on Left, Sticky Booking Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery, Specs, Description & Rules */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Gallery */}
          <BikeGallery images={bike.images} bikeName={bike.name} />

          {/* Bike Title & Quick Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-amber-600 tracking-wider">
                  {bike.brand}
                </span>
                <span className="text-slate-300">•</span>
                <Badge variant="amber" size="sm">
                  {bike.category.toUpperCase()}
                </Badge>
                {bike.tag && (
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {bike.tag}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
              {bike.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">{bike.model} ({bike.year})</p>

            {/* Ratings & Hub location */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-slate-900">{bike.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({bike.reviewCount} verified reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Base Hub: {bike.locationName}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>250 km/day included</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Technical Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block mb-1">Engine / Power</span>
                <span className="font-bold text-slate-900 text-sm">
                  {bike.fuelType === 'Electric' ? 'EV Motor' : `${bike.engineCC} cc`}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block mb-1">Transmission</span>
                <span className="font-bold text-slate-900 text-sm">{bike.transmission}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block mb-1">Fuel / Range</span>
                <span className="font-bold text-slate-900 text-sm">{bike.fuelType} ({bike.mileage})</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block mb-1">Seating Capacity</span>
                <span className="font-bold text-slate-900 text-sm">{bike.seatingCapacity} Persons</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block mb-1">Model Year</span>
                <span className="font-bold text-slate-900 text-sm">{bike.year}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block mb-1">Security Deposit</span>
                <span className="font-bold text-emerald-700 text-sm">₹{bike.securityDeposit} (Refundable)</span>
              </div>
            </div>
          </div>

          {/* Description & Included Features */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">About this Motorcycle</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{bike.description}</p>

            <div className="pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Key Equipped Features:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {bike.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Rental Rules (Section 32) */}
          <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <span>Rental Guidelines & Safety Policy</span>
              </h3>
              <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                Sample Policy
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
              {bike.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">
                  {rule}
                </li>
              ))}
              <li className="leading-relaxed">
                Security deposit is refunded within 30 minutes of vehicle inspection at dropoff.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Sticky Rental Booking Panel */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-5">
            {/* Price Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500 font-medium">Rental Tariff</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-slate-900">₹</span>
                  <span className="text-3xl font-black text-slate-950">{bike.pricePerDay}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ 24 hrs</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Deposit</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  ₹{bike.securityDeposit} Refundable
                </span>
              </div>
            </div>

            {/* Hub Selectors */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Pickup Hub
                </label>
                <select
                  value={draft.pickupLocationId}
                  onChange={(e) => updateDraft({ pickupLocationId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.city} - {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Dropoff Hub
                </label>
                <select
                  value={draft.returnLocationId}
                  onChange={(e) => updateDraft({ returnLocationId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.city} - {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time Selectors */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={draft.pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => updateDraft({ pickupDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Pickup Time
                </label>
                <select
                  value={draft.pickupTime}
                  onChange={(e) => updateDraft({ pickupTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-semibold"
                >
                  {['06:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  value={draft.returnDate}
                  min={draft.pickupDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => updateDraft({ returnDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Return Time
                </label>
                <select
                  value={draft.returnTime}
                  onChange={(e) => updateDraft({ returnTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-semibold"
                >
                  {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Availability Checker */}
            <AvailabilityChecker
              bike={bike}
              pickupDate={draft.pickupDate}
              pickupTime={draft.pickupTime}
              returnDate={draft.returnDate}
              returnTime={draft.returnTime}
            />

            {/* Live Price Breakdown Component */}
            <PriceBreakdown
              pricePerDay={bike.pricePerDay}
              securityDeposit={bike.securityDeposit}
              durationDays={pricing.durationDays}
              addons={draft.addons}
              pricing={pricing}
            />

            {/* Book Now Button */}
            <Button
              onClick={handleProceedToBooking}
              disabled={!bike.available}
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-amber-500/25 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {bike.available ? 'Proceed to Book Ride' : 'Currently Booked Out'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
