import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0C11] text-slate-400 pt-16 pb-24 md:pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
                V
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                VELO<span className="text-amber-400">MOTION</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering freedom, mobility, and everyday adventures with dependable bike, scooter, and electric rentals across Karnataka. Transparent pricing, zero hidden charges, and sanitized fleet.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="flex items-center gap-1.5 bg-[#161B22] border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Verified Fleet & Insurance
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Explore Fleet
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/bikes" className="hover:text-amber-400 transition-colors">
                  All Motorcycles & Scooters
                </Link>
              </li>
              <li>
                <Link to="/bikes?category=cruiser" className="hover:text-amber-400 transition-colors">
                  Royal Enfield Cruisers
                </Link>
              </li>
              <li>
                <Link to="/bikes?category=sports" className="hover:text-amber-400 transition-colors">
                  Sports & Hyper Nakeds
                </Link>
              </li>
              <li>
                <Link to="/bikes?category=electric_scooter" className="hover:text-amber-400 transition-colors">
                  Electric Ather & Ola Scooters
                </Link>
              </li>
              <li>
                <Link to="/bikes?category=adventure" className="hover:text-amber-400 transition-colors">
                  Adventure & Touring Bikes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Company & Help
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/locations" className="hover:text-amber-400 transition-colors">
                  Rental Hub Locations
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-colors">
                  Long-Term & Tourist Rentals
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  About VeloMotion
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  24/7 Roadside Assistance
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-amber-400 transition-colors">
                  Check Booking Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations & Contact */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Karnataka Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Bengaluru: Koramangala & Indiranagar</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Mysuru: Gokulam & Central Railway Station</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Chamarajanagara: B.R. Hills Main Road</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Mangaluru: City Centre Coastal Hub</span>
              </li>
              <li className="pt-2 flex items-center gap-2 text-slate-300 font-semibold text-xs">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 80 4123 7890</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Prototype notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} VeloMotion Mobility Solutions. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <span className="text-slate-400">Mysuru</span>
            <span className="text-slate-400">Bengaluru</span>
            <span className="text-slate-400">Chamarajanagara</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Safety • Convenience • Freedom</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
