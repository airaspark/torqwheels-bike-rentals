import React from 'react';
import { Filter, RotateCcw, Check, Sparkles, MapPin } from 'lucide-react';
import { SearchFilterState, LocationHub } from '../../types';
import { Button } from '../common/Button';

interface BikeFiltersProps {
  filters: SearchFilterState;
  locations: LocationHub[];
  onChange: (updates: Partial<SearchFilterState>) => void;
  onReset: () => void;
  className?: string;
}

export const BikeFilters: React.FC<BikeFiltersProps> = ({
  filters,
  locations,
  onChange,
  onReset,
  className = '',
}) => {
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'cruiser', label: 'Cruiser Bikes' },
    { id: 'sports', label: 'Sports Bikes' },
    { id: 'adventure', label: 'Adventure Tourers' },
    { id: 'scooter', label: 'Scooters' },
    { id: 'electric_scooter', label: 'Electric (EV)' },
    { id: 'commuter', label: 'Commuter Bikes' },
  ];

  const priceRanges = [
    { label: 'All Prices', min: 0, max: 10000 },
    { label: 'Under ₹500/day', min: 0, max: 500 },
    { label: '₹500 – ₹1,000/day', min: 500, max: 1000 },
    { label: '₹1,000 – ₹2,000/day', min: 1000, max: 2000 },
    { label: '₹2,000+/day', min: 2000, max: 10000 },
  ];

  const engineRanges = [
    { id: 'all', label: 'All Capacities' },
    { id: '100-125', label: '100 – 125cc' },
    { id: '150-200', label: '150 – 200cc' },
    { id: '250-400', label: '250 – 400cc' },
    { id: '400+', label: '400cc & Above' },
    { id: 'ev', label: 'Electric EV Powertrain' },
  ];

  const transmissions = [
    { id: 'all', label: 'All' },
    { id: 'Manual', label: 'Manual' },
    { id: 'Automatic', label: 'Automatic (CVT)' },
  ];

  const fuels = [
    { id: 'all', label: 'All' },
    { id: 'Petrol', label: 'Petrol' },
    { id: 'Electric', label: 'Electric (Zero Emission)' },
  ];

  const isPriceActive = (min: number, max: number) => {
    return filters.minPrice === min && filters.maxPrice === max;
  };

  return (
    <div
      className={`bg-[#161B22] text-[#F8FAFC] rounded-2xl sm:rounded-3xl border border-white/10 p-5 shadow-2xl divide-y divide-white/5 space-y-5 ${className}`}
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-white text-base">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Available Only Switch */}
      <div className="pt-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-semibold text-slate-200 group-hover:text-amber-400">
            Available Only
          </span>
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(e) => onChange({ availableOnly: e.target.checked })}
            className="w-4 h-4 rounded bg-[#0B0C11] border-white/20 text-amber-500 focus:ring-amber-400"
          />
        </label>
      </div>

      {/* Location Hub Filter */}
      <div className="pt-4 space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Location Hub
        </label>
        <select
          value={filters.locationId}
          onChange={(e) => onChange({ locationId: e.target.value })}
          className="w-full bg-[#0B0C11] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="all" className="bg-[#161B22] text-white">All Karnataka Hubs</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id} className="bg-[#161B22] text-white">
              {loc.city} - {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bike Category Filter */}
      <div className="pt-4 space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Bike Category
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ category: cat.id })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                filters.category === cat.id
                  ? 'bg-[#F59E0B] text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              {filters.category === cat.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Price Per Day
        </label>
        <div className="space-y-1">
          {priceRanges.map((p) => {
            const active = isPriceActive(p.min, p.max);
            return (
              <button
                key={p.label}
                onClick={() => onChange({ minPrice: p.min, maxPrice: p.max })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#F59E0B] text-black font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{p.label}</span>
                {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Engine CC Range */}
      <div className="pt-4 space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Engine Capacity / CC
        </label>
        <div className="space-y-1">
          {engineRanges.map((eng) => (
            <button
              key={eng.id}
              onClick={() => onChange({ engineCCRange: eng.id })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                filters.engineCCRange === eng.id
                  ? 'bg-[#F59E0B] text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{eng.label}</span>
              {filters.engineCCRange === eng.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission Filter */}
      <div className="pt-4 space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Transmission
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {transmissions.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ transmission: t.id })}
              className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-colors border ${
                filters.transmission === t.id
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-[#0B0C11] text-slate-300 border-white/10 hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="pt-4 space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Fuel Type
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {fuels.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ fuelType: f.id })}
              className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-colors border ${
                filters.fuelType === f.id
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-[#0B0C11] text-slate-300 border-white/10 hover:bg-white/5'
              }`}
            >
              {f.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
