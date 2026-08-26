import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Compass, Users, Sparkles, Award, Heart, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Our Story & Purpose
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950">
          Powering the Spirit of Two-Wheeled Freedom
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          TorqWheels was built with a simple mission: to empower riders, commuters, tourists, and adventure seekers with seamless access to dependable, well-maintained motorcycles and smart scooters without the burdens of vehicle ownership.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Mobility & Adventure</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            From quick city hops in Bangalore to thrilling monsoon tours to Wayanad, Coorg, and Ooty, we have the ideal machine for every terrain.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Uncompromising Safety</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every bike in our fleet undergoes rigorous 40-point safety audits, brake servicing, and tyre tread evaluations before being handed over.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Zero Hidden Charges</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            What you see is what you pay. Transparent daily pricing, clearly listed refundable security deposits, and free 250 km daily allowance.
          </p>
        </div>
      </div>

      {/* Fleet Stats Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <p className="text-3xl font-black text-amber-400">12,000+</p>
          <p className="text-xs text-slate-400 mt-1">Trips Completed</p>
        </div>
        <div>
          <p className="text-3xl font-black text-amber-400">500+</p>
          <p className="text-xs text-slate-400 mt-1">Bikes & Scooters</p>
        </div>
        <div>
          <p className="text-3xl font-black text-amber-400">6 Hubs</p>
          <p className="text-xs text-slate-400 mt-1">Across Karnataka</p>
        </div>
        <div>
          <p className="text-3xl font-black text-amber-400">4.9 ★</p>
          <p className="text-xs text-slate-400 mt-1">Customer Rating</p>
        </div>
      </div>
    </div>
  );
};
