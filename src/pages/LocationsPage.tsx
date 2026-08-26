import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Bike, ArrowRight, ShieldCheck, Navigation } from 'lucide-react';
import { LocationService } from '../services/location.service';
import { LocationHub } from '../types';
import { Button } from '../components/common/Button';

export const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<LocationHub[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    LocationService.getActiveLocations().then(setLocations);
  }, []);

  const cities = ['all', 'Mysuru', 'Bengaluru', 'Chamarajanagara', 'Mangaluru'];

  const filteredLocations = locations.filter(
    (loc) => selectedCity === 'all' || loc.city.toLowerCase() === selectedCity.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Statewide Network
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          TorqWheels Rental Stations & Hubs
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Convenient pickup and dropoff points across key transit spots, railway stations, tech corridors, and tourist hubs in Karnataka.
        </p>
      </div>

      {/* City Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCity(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
              selectedCity === c
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c === 'all' ? 'All Stations' : c}
          </button>
        ))}
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 p-6 shadow-xs hover:shadow-lg transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                  {loc.city}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-amber-500" />
                  <span>{loc.bikeCount} Bikes Stationed</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-950">{loc.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{loc.address}</span>
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{loc.openingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900">{loc.contactPhone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <Link
                to={`/bikes?location=${loc.id}`}
                className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Browse Hub Fleet
              </Link>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                title="Open in Maps"
              >
                <Navigation className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
