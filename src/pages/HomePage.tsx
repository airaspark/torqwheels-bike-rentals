import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  ShieldCheck,
  Zap,
  Key,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Award,
  HelpCircle,
  ChevronRight,
  Shield,
  FileCheck,
} from 'lucide-react';
import { BikeService } from '../services/bike.service';
import { LocationService } from '../services/location.service';
import { Bike, LocationHub } from '../types';
import { CATEGORY_DEFINITIONS } from '../data/mockData';
import { BookingSearchWidget } from '../components/booking/BookingSearchWidget';
import { BikeCard } from '../components/bikes/BikeCard';
import { Button } from '../components/common/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredBikes, setFeaturedBikes] = useState<Bike[]>([]);
  const [locations, setLocations] = useState<LocationHub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([BikeService.getFeaturedBikes(), LocationService.getActiveLocations()]).then(
      ([bikes, locs]) => {
        setFeaturedBikes(bikes);
        setLocations(locs);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B0C11] text-white pt-10 pb-20 sm:pb-28 overflow-hidden">
        {/* Subtle glow overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#161B22] border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Next-Gen Two-Wheeler Mobility in Karnataka</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Ride Your <span className="text-amber-400">Way.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Rent reliable bikes for your city rides, weekend trips, and everyday adventures. Zero hassle, transparent pricing, and instant hub pickups across Mysuru, Bengaluru & beyond.
              </p>

              {/* Badges / Metrics */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2 bg-[#161B22] border border-white/10 px-3.5 py-2 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Sanitized Fleet</span>
                </div>
                <div className="flex items-center gap-2 bg-[#161B22] border border-white/10 px-3.5 py-2 rounded-xl">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>Zero Hidden Charges</span>
                </div>
                <div className="flex items-center gap-2 bg-[#161B22] border border-white/10 px-3.5 py-2 rounded-xl">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>EV & Petrol Options</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Booking / Search Widget */}
            <div className="lg:col-span-6 w-full">
              <BookingSearchWidget />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="-mt-10 sm:-mt-16 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161B22] border border-white/10 rounded-2xl sm:rounded-3xl p-6 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">500+</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Bikes & Scooters Fleet
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">6 Hubs</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Bengaluru, Mysuru, Chamarajanagar
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">4.9 ★</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Over 12,000+ Happy Riders
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">250 km</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Free Daily Kilometres
            </p>
          </div>
        </div>
      </section>

      {/* 3. BIKE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
              Browse by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Find the Perfect Machine for Your Ride
            </h2>
          </div>
          <Link
            to="/bikes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View All Bikes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_DEFINITIONS.map((cat) => (
            <Link
              key={cat.id}
              to={`/bikes?category=${cat.id}`}
              className="group bg-[#161B22] rounded-2xl border border-white/10 hover:border-amber-500/50 p-4 text-center transition-all hover:shadow-2xl flex flex-col items-center justify-between"
            >
              <div className="h-24 w-full rounded-xl overflow-hidden mb-3 bg-black/50">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{cat.count} Models</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED BIKES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
              Most Popular Fleet
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Featured Bikes & Scooters
            </h2>
          </div>
          <Link
            to="/bikes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300"
          >
            <span>Explore All Fleet ({featuredBikes.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#161B22] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-[#161B22] border border-white/10 text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
            Quick 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold">How VeloMotion Works</h2>
          <p className="text-slate-400 text-sm">
            We’ve eliminated paperwork and long queues. Get your bike keys in under 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Select Bike & Hub',
              desc: 'Choose your desired model, pickup hub in Bangalore/Mysuru, and rental dates.',
              icon: Compass,
            },
            {
              step: '02',
              title: 'Instant Booking',
              desc: 'Provide your driving licence number and confirm your booking with flexible payment.',
              icon: ShieldCheck,
            },
            {
              step: '03',
              title: 'Quick Counter Pickup',
              desc: 'Show your original DL at our station, collect your sanitized bike and free helmet.',
              icon: Key,
            },
            {
              step: '04',
              title: 'Ride & Return',
              desc: 'Enjoy unlimited highway freedom. Drop off at any active station with instant deposit refund.',
              icon: Clock,
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-[#0B0C11] border border-white/5 rounded-2xl p-6 relative group hover:border-amber-500/50 transition-colors"
              >
                <span className="text-3xl font-black text-slate-800 group-hover:text-amber-500/40 transition-colors">
                  {s.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center my-4 border border-amber-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SAMPLE RENTAL RULES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161B22] border border-amber-500/30 rounded-3xl p-6 sm:p-10 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                Transparent Policies
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Standard Rental Terms & Rider Safety
              </h3>
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-400 font-bold px-3.5 py-1.5 rounded-full border border-amber-500/30">
              Prototype Sample Rules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs text-slate-300">
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Eligibility & Documents</span>
              </h4>
              <p className="leading-relaxed text-slate-400">
                Rider must be at least 18 years of age and hold a valid government-issued 2-wheeler Driving Licence. Original DL must be presented at the pickup counter.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Fuel & Security Deposit</span>
              </h4>
              <p className="leading-relaxed text-slate-400">
                Fuel is provided level-to-level. Security deposits (₹500 to ₹2500 based on model) are refunded immediately upon vehicle return inspection.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Helmets & Kilometres</span>
              </h4>
              <p className="leading-relaxed text-slate-400">
                Every rental includes 1 sanitized ISI-certified helmet and 250 free km per day. Pillion helmets, jackets, and phone mounts are available as addons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CITY HUBS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
            Convenient Pickup Points
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Explore Karnataka Hubs
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Pick up from one hub and drop off at another across Bengaluru, Mysuru, Chamarajanagara, and Mangaluru.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-[#161B22] rounded-2xl border border-white/10 p-5 shadow-2xl hover:border-amber-500/50 transition-all space-y-3 text-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  {loc.city}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{loc.bikeCount} Bikes Fleet</span>
              </div>
              <h3 className="font-bold text-white text-base">{loc.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{loc.address}</p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="text-[11px] text-slate-400">{loc.openingHours}</span>
                <Link to="/locations" className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5">
                  <span>View Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#161B22] via-[#1c222b] to-[#241c10] rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Hit the Road?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Book your ride in under 2 minutes. Instant availability, well-maintained bikes, and 24/7 roadside assistance guarantee.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/bikes')}
                variant="primary"
                size="lg"
                className="shadow-xl shadow-amber-500/20 font-bold px-8 py-3.5"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse All Bikes Now
              </Button>
              <Button
                onClick={() => navigate('/locations')}
                variant="secondary"
                size="lg"
                className="border border-white/10 text-white hover:bg-white/5 px-8 py-3.5"
              >
                View Hub Locations
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
