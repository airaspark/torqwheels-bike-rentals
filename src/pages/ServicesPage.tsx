import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Briefcase, Zap, Shield, Wrench, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Daily & Weekend Rentals',
      desc: 'Flexible 24-hour rentals perfect for local errands, city touring, and weekend getaways across South India.',
      icon: Clock,
      highlight: 'Starting at ₹299/day',
    },
    {
      title: 'Monthly Subscriptions',
      desc: 'Affordable long-term packages for students, techies, and professionals without EMIs, insurance, or maintenance costs.',
      icon: Calendar,
      highlight: 'Save up to 40%',
    },
    {
      title: 'Touring & Highway Packages',
      desc: 'Equipped adventure tourers (Himalayan, KTM Adventure) with top racks, USB chargers, and saddle stays for Western Ghats expeditions.',
      icon: Briefcase,
      highlight: 'Free 350km/day options',
    },
    {
      title: 'Green EV Scooter Fleet',
      desc: 'Zero-emission smart electric rides (Ather 450X, Ola S1) with home charging adapters and complimentary hub fast charging.',
      icon: Zap,
      highlight: 'Zero fuel cost',
    },
    {
      title: '24/7 Roadside Assistance',
      desc: 'On-demand mechanical support, puncture rescue, and towing assistance across all major Karnataka highway corridors.',
      icon: Wrench,
      highlight: '1800-TOW-TORQ',
    },
    {
      title: 'Corporate & Bulk Fleet Rentals',
      desc: 'Customized fleet management solutions for delivery aggregators, hotel concierges, and corporate campuses.',
      icon: Shield,
      highlight: 'Custom SLA',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Our Rental Offerings
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          Tailored Mobility Services for Every Rider
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Whether you need a commuter scooter for a day or an adventure bike for a week-long tour, we have the right rental package.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, idx) => {
          const Icon = svc.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {svc.highlight}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{svc.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{svc.desc}</p>
              </div>

              <Link
                to="/bikes"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 pt-2 border-t border-slate-100"
              >
                <span>Browse Compatible Bikes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
